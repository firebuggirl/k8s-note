


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

kbc knote-js/01/kube/knote.yaml

kbc knote-js/01/kube/mongo.yaml

kb explain deployment.spec.replicas


```
