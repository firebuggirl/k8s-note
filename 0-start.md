


```yaml
nvm use 13
```

https://academy.learnk8s.io/02k8s-js-intro#main-menu

`git clone git@github.com:learnk8s/knote-js.git`

## TL;DR: recap in 5 simple steps

- You `cloned the following repo` and change opened the `01 folder`.

- You installed the dependencies with `npm install`.

- You started the app with `node index.js`, but it fails because it can't connect to a database.

- You opened a new terminal and in the same folder launched mongodb with `npm run mongo` (make sure there's a /data/db folder on your computer). The application connected to it.

- You visited the application on `http://localhost:3000` and submitted notes with images.

## use Multer, a middleware for multi-part form data, to handle the uploaded data.

## Rendering Markdown to HTML

`npm install marked`

## Uploading pictures

- file should be saved on disk, and a link should be inserted in the text box.

- use Multer to handle the uploaded pictures

## Containerisation with Docker

https://academy.learnk8s.io/02k8s-js-infrastructure

`docker build -t knote .`

- run MongoDB:

```yaml
docker network create knote

docker run \
  --name=mongo \
  --rm \
  --network=knote mongo
```

- run app:

```yaml
docker run \
  --name=knote \
  --rm \
  --network=knote \
  -p 3000:3000 \
  -e MONGO_URL=mongodb://mongo:27017/dev \
  knote
```

- `Note`:

 - look @ value of MONGO_URL => hostname = mongo

 - Why is it mongo and not an IP address?

 - `mongo` is the `name that you gave to the MongoDB container` with the `--name=mongo` flag

 - If named container `foo`, then change the value of MONGO_URL to `mongodb://foo:27017`

## Push to Dockerhub

```yaml
docker tag knote <username>/knote-js:1.0.0

docker push <username>/knote-js:1.0.0

# re-run app w/new image name
docker run \
  --name=mongo \
  --rm \
  --network=knote \
  mongo

docker run \
  --name=knote \
  --rm \
  --network=knote \
  -p 3000:3000 \
  -e MONGO_URL=mongodb://mongo:27017/dev \
  <username>/knote-js:1.0.0

# stop and remove containers
docker stop mongo knote
docker rm mongo knote
```

## Deploying to Kubernetes

### Creating a local Kubernetes cluster

- use `MicroK8s` via my `Ubuntu VM`...or `GKE`

```yaml
kubectl cluster-info

mkdir kube

cd kube

kbc knote.yaml

kbc mongo.yaml

kb explain deployment.spec.replicas

# get IP address 
kb describe services knote

# or => take note of EXTERNAL-IP `localhost`
kb get svc -o wide
```

## Scaling

## Making the app stateless

- application saves uploaded pictures in the local file system

- pictures are saved within the container's file system

- w/ two replicas === issue

- application is `stateful`


- must make app stateless before scaling it

- `MinIO` is an o`pen-source object storage service` that can be installed on your infrastructure.

- install the MinIO SDK for JavaScript:

 `npm install minio --save`

- modify the handler of the `/note` route to `save the pictures to MinIO`, rather than to the local file system 

- to run app locally, must run its dependencies

```yaml
docker run \
  --name=minio \
  --rm \
  -p 9000:9000 \
  -e MINIO_ACCESS_KEY=mykey \
  -e MINIO_SECRET_KEY=mysecret \
  minio/minio server /data


  docker run \
  --name=mongo \
  --rm \
  -p 27017:27017 \
  mongo

# start the app locally
MINIO_ACCESS_KEY=mykey MINIO_SECRET_KEY=mysecret node index.js
# now uploaded pictures are saved in the MinIO object storage rather than on the local file system

# re-deploy to Docker
docker login

docker build -t juliettet/knote-js:2.0.0 .

docker push juliettet/knote-js:2.0.0

# rerun app with all three components as Docker containers
# make sure that you still have the knote Docker network:
docker network ls

docker run \
  --name=mongo \
  --rm \
  --network=knote \
  mongo


docker run \
  --name=minio \
  --rm \
  --network=knote \
  -e MINIO_ACCESS_KEY=mykey \
  -e MINIO_SECRET_KEY=mysecret \
  minio/minio server /data

# run the Knote container
docker run \
  --name=knote \
  --rm \
  --network=knote \
  -p 3000:3000 \
  -e MONGO_URL=mongodb://mongo:27017/dev \
  -e MINIO_ACCESS_KEY=mykey \
  -e MINIO_SECRET_KEY=mysecret \
  -e MINIO_HOST=minio \
  juliettet/knote-js:2.0.0

# http://localhost:3000

# clean up:
docker stop knote minio mongo
docker rm knote minio mongo
```

## Back to Kubernetes

- update `knote.yaml`

- like MongoDB, MinIO requires persistent storage to save its state + must be exposed with a Service via `minio.yaml`

## Deploy the new version of app to Kubernetes

```yaml
cd /kube

kbc knote.yaml

kbc minio.yaml

kbc mongo.yaml

kbgp -w

# get IP address 
kb describe services knote

# or => take note of EXTERNAL-IP `localhost`
kb get svc -o wide

# ..forgot to delete old volume...old pics not showing, but new upload works

# test scale
scale --replicas=10 deployment/knote
kbgp -l app=knote -w

# reload web browser => make sure pics displayed

kb delete deployment.apps/mongo deployment.apps/minio deployment.apps/knote

kb delete svc knote minio mongo
```

## three components:


- `Knote` => primary app for creating notes

- `MongoDB` => for storing the text 

- `MinIO` => for storing the pictures 

## Deploying to the cloud

https://academy.learnk8s.io/02k8s-js-cloud

### AWS 

#### Amazon Elastic Kubernetes Service (EKS) 

- create the cluster w/ `eksctl` => https://github.com/weaveworks/eksctl#usage => a simple CLI tool for creating clusters on EKS 

- `macOS`:

  ```yaml
  brew tap weaveworks/tap

  # error =>  Unable to create '/usr/local/Homebrew/.git/index.lock': File exists.

  rm -rf /usr/local/Homebrew/.git/index.lock

  brew tap weaveworks/tap //works now

  brew install weaveworks/tap/eksctl

  # paths
  /usr/local/Cellar/kubernetes-cli
  /usr/local/Cellar/eksctl

  eksctl version //0.30.0
  ```

- `default parameters` w/ `eksctl create cluster`:

  - auto-generated name

  - 2x m5.large nodes

  - use official AWS EKS AMI

  - dedicated VPC (check quotas)

  - using static AMI resolver

- cluster credentials `~/.kube/config`

## Create cluster

- `docs` => https://eksctl.io/usage/creating-and-managing-clusters/

 `eksctl create cluster --region=us-west-2 --name=knote`//takes around 15 minutes => timed out...not working!!

 - try running default (ie., w/out region..should automatically create cluster in my/your default region):

 `eksctl create cluster --name=knote`

 ```yaml
 # https://github.com/weaveworks/eksctl/issues/1482
 eksctl get clusters

 eksctl get clusters -v 4
 # Any node using m5n.large instance type never joins the cluster 
 ```

- no access to the master nodes => AWS runs the master nodes

- the worker nodes are regular `Amazon EC2 instances` => inspect them in the `AWS EC2 Console`

- inspect the `Amazon EKS resource` => in `AWS EKS Console`

- `resources` created by eksctl:

   - networking, access control, security, and logging....

## Deploy to AWS

```yaml
  cd /kube

  kbc knote.yaml

  kbc minio.yaml

  kbc mongo.yaml

  kbgp -w

  # get IP address 
  kb describe services knote

  # or => take note of EXTERNAL-IP `localhost`
  kb get svc -o wide

  # scale
  kb scale --replicas=10 deploy knote

  # should see 9 Pods
  kbgp -A 

  # exceed this limit on purpose to observe what happens
  # can be up to 50 replicas of the Knote Pod
  # 50 should be running & remaining ten should be stuck in the Pending state.
  kb scale --replicas=60 deployment/knote

  # should output 50
  kubectl get pods \
  -l app=knote \
  --field-selector='status.phase=Running' \
  --no-headers | wc -l

  # should output 10
  kubectl get pods \
  -l app=knote \
  --field-selector='status.phase=Pending' \
  --no-headers | wc -l

  kubectl get pods \
  --all-namespaces \
  --field-selector='status.phase=Running' \
  --no-headers | wc -l

  kubectl scale --replicas=50 deployment/knote

```

## resource limits

- `Amazon EKS` => limits depend on the `EC2 instance type` selected

- `m5.large` instance type that you are using for worker nodes => up to `29 Pods` => 2 worker nodes === up to `58 pods`

- cost => around USD `0.40 per hour` for running cluster

## Clean up

`eksctl delete cluster --region=us-west-2 --name=knote`

- double-check that the AWS resources have been deleted in the AWS Console:

  - Check: the `AWS EKS Console` and verify that the Amazon EKS cluster resource has been removed (or is being deleted)

  - Check: the `AWS EC2 Console` and confirm that the EC2 instances that were your worker nodes have been removed (or are being deleted)


## Amazon EC2 Spot Instances

https://aws.amazon.com/ec2/spot/?cards.sort-by=item.additionalFields.startDateTime&cards.sort-order=asc

### Running Containers at Lower Cost

https://aws.amazon.com/ec2/spot/containers-for-less/

#### Tutorials/Blogs/Webinars

- Kuberenetes on Spot Instances tutorial

- Improve Kuberentes cluster costs and resilience 

- TensorFlow serving on Kubernetes with Spot Instances

- Seamlessly handle Spot interruptions

- `repo` => `Powering your Amazon ECS Cluster with Amazon EC2 Spot Instances` => https://github.com/awslabs/ec2-spot-labs/tree/master/ecs-ec2-spot-fleet

### Web services

https://aws.amazon.com/ec2/spot/getting-started/#Web_Applications_and_Services_on_Spot_Instances

### Image and media rendering

https://aws.amazon.com/ec2/spot/getting-started/#Rendering_Workloads_on_Spot_Instances

## Spot instances for eksctl

https://eksctl.io/usage/spot-instances/

## Amazon EC2 Instance Types

https://aws.amazon.com/ec2/instance-types/
