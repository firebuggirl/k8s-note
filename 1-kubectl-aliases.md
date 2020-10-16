# aliases:
  
  
   ```c
     alias kb=kubectl 

     alias kbgs="kubectl get secrets"

     alias kbe="kubectl edit"

     alias kbgp="kubectl get pods"

     alias kbdp="kubectl describe pod"
     
     alias kbdn="kubectl describe node"

     alias kbep="kubectl edit pod"

     alias kbc="kubectl create -f"
     
     alias kbgn="kubectl get nodes"

     alias kbgn="kubectl get namespaces"

     alias kbgpan="kubectl get pods --all-namespaces"

     alias cl=clear

     alias kbcn="kubectl create namespace"

     alias kba="kubectl apply -f"

     alias kbc="kubectl create -f"

     alias kbd="kubectl delete"  

     alias kbed="kubectl edit deployment"

     alias kbsd="kb scale deployment"

     alias kbcd="kubectl create deployment"

     alias dry="--dry-run=client -o yaml"

     export fo="--grace-period=0 --force"

     export do="--dry-run=client -o yaml"

     export fl="--from-literal="

     alias dr="--restart=Never"

     alias dry="--restart=Never  -o yaml --dry-run=client"

     alias sc="kubectl config set-context --current --namespace="

     alias rj="--restart=OnFailure"

     export cj="--restart=OnFailure --schedule="

     alias kbrh="kubectl rollout history"

     alias kbru="kubectl rollout undo"

     alias r="--record"

     alias kbrsd="kubectl rollout status deployment"

     alias kbsi="kubectl set image deployment"

     alias kbdd="kubectl describe deployment"

     alias kbln="kubectl label nodes"

     alias kbgnsl="kubectl get nodes --show-labels"

     alias kbgpsl="kubectl get pods --show-labels"

     alias kbcc="kubectl config current-context"

     alias kbsc="kubectl config set-context --current"

     alias kbcj="kubectl create job"

     alias kbccj="kb create cj cj1 -o yaml --dry-run=client --schedule="*/1 * * * *" --image=throw-dice > cj1.yaml"

     alias kbed="kubectl expose deploy"

     alias kbexp="kubectl expose pod"

     alias kbr="kubectl run"

     alias rn="--restart=Never"

     alias kbe="kubectl exec -it"

     alias kbepge="kubectl explain pods --recursive | grep envFrom -A3"

     alias kbdnogt="kubectl explain node node01 | grep -i taint"
 
     alias kbdnmgt="kubectl explain node master | grep -i taint"
     
     alias kbepr="kubectl explain pod --recursive | less"

     alias kbepgt="kubectl explain pod --recursive | grep -A5 tolerations"
     
     # check which apis support current Kubernetes object using
     alias kbgds="kubectl api-resources | grep deployment"

     alias kbgis="kubectl api-resources | grep ingress"
```

- `remove taint from Node` EX:

     `kubectl taint node node01 <taint-name>-` //add `-` symbol
- create `job`:

`kb create job job1 -o yaml --dry-run=client --image=busybox`

- make sure that the Job template still contains `restartPolicy: Never` or `restartPolicy: OnFailure`

`create job job1 -oyaml --image=busybox --dry-run=client > job1.yaml`

- set ns ex:

 ```yaml
 # get current context
 alias kcc="kubectl config current-context"

 kcc --namespace=k8n-challenge-2-a
 ```

 `kubectl config set-context --current --namespace=<namespace>`

## Always remember to set the right namespace before you attempt the question. If namespace is not given use the default namespace but you still need to set it as the earlier question might have forced you to use a different namespace.

 `kb config set-context --current --namespace=dev`

- prints out the current context, namespace and then all possible Kubernetes objects => https://codeburst.io/kubernetes-ckad-weekly-challenges-overview-and-tips-7282b36a2681

```yaml
watch -n 0.5 "kubectl config current-context; echo ''; kubectl config view | grep namespace; echo ''; kubectl get namespace,node,ingress,pod,svc,job,cronjob,deployment,rs,pv,pvc,secret,ep -o wide"
```

- label nodes;

  `kubectl label nodes <node-name> <key>=<value>`
  
- get current version of image/deploy

`kubectl describe deployments.apps nginx-deploy | grep -i ima`

- update image version => `kubectl set image deployment myapp-deployment nginx-container=nginx:1:12`

- create new pod yaml => `kubectl get pod <pod-name> -o yaml > pod-definition.yaml`

- delete several pods => `kb delete pod $fo --selector=name=busybox-pod`
  
  - ie., `kubectl config set-context --current --namespace=dev` //dev namespace...so that you do not have to type -n dev with every other command...or `kubectl config --kubeconfig=config-demo use-context dev-frontend`???? see https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/

  
  - to type export variables => `$fo`

  
  - to type export variables => `$do`
 
 .etc...

 - check different options for volume mounts:

 `kubectl explain pods --recursive | less`//go to volumeMounts to see avialable options => https://kodekloud.com/courses/438996/lectures/14468364 12:57


`kubectl run --restart=Never`//pod 

`kubectl create --restart=OnFailure`//job

`kb create job job1 -o yaml --dry-run=client --image=busybox > job.yaml`//job

`kb create --restart=OnFailure --schedule=""`

`kb create --restart=OnFailure --schedule="30 21 * * *"`//cronjob 1 min => `"*/1 * * * *"`

`kb create cj cj1 -o yaml --dry-run=client --schedule="*/1 * * * *" --image=busybox > cj1.yaml`/cronjob/

`--labels="k1=v1,k2=v2"` Adding labels to the resource being created

`--env="k1=v1" --env="k2=v2"` Adding simple environment variables in form of key value pairs
Specify arguments to the container using `-- /bin/sh -c "ls -l /etc/passwd"`

## Be fast with a bash in general

- Use the `history` command to reuse already entered commands
- use even faster history search through `Ctrl r`

## Setting following preferences for vim ( right at the beginning of the exam )

https://medium.com/swlh/yacr-yet-another-ckad-resource-46c654de871

- These settings would help you with using TAB key instead of pressing SPACE twice 

```js
vim ~/.vimrc
set nu
set ic
set expandtab
set shiftwidth=2
set tabstop=2
```

## be comfortable doing the following in Vim or Nano

- `Copy 5 lines from line 20` and `paste at line 38` — Go to line number 20 by typing `:20` and select the complete line by `V` , `select more lines` using the `down arrow` and `copy using y`(cut using d) and finally `paste` using `p` Also delete lines using `dd` and undo using `u`

- `Select certain text` in the editor and `shift them right or left` — Use `V` to select a `complete line` (visual copy) and `select more` using `JJ` (or arrow keys) and move left and right using `shift` + `< and >` respectively

    https://opensource.com/article/19/2/getting-started-vim-visual-mode => more tips here...

   - Once the text is highlighted, press the `d` key to delete the text.
   - If you deleted too much or not enough, press `u` to undo and start again.
   - Move your cursor to the new location and press `p` to paste the text.

- Comfortable in searching and moving around in the editor of your choice

- may also be required to `ssh` onto the worker nodes to create some files (hint: required for `local volumes`!)

- basic knowledge of `grep` and `piping commands` and `redirecting output to files` won’t hurt

  - EX:

     - instead of using `kubectl explain deployment.spec.template.spec.containers — recursive` and then going through the multi-page output => use `less`

     `kubectl explain deployment.spec.template.spec.containers --recursive | grep -i ports -A10`

       - search for ports in the output of the first explain command and only show the next 10 lines 

## Aliases

- The default terminal shell in the exam does not come with any aliases or shell completion for kubectl 

  - set up ex:

    ```yaml
    alias k=kubectl
    alias kaf="k apply -f"
    
    ```

    `alias kdr= 'kubectl -n $ns -o yaml --dry-run'`

## Shell auto-complete for kubectl

  ```yaml
  echo 'source <(kubectl completion bash)' >>~/.bashrc

  kubectl completion bash >/etc/bash_completion.d/kubectl
  ```

  - `Shell auto-complete commands` are also `explained here` in case you want to setup on your local machine and try out the benefits => https://kubernetes.io/docs/tasks/tools/install-kubectl/#optional-kubectl-configurations

    - If you have an alias for kubectl, you can extend shell completion to work with that alias:

     ```yaml
     echo 'alias k=kubectl' >>~/.bashrc
     ech
     
     Note: bash-completion sources all completion scripts in /etc/bash_completion.d.o 'complete -F __start_kubectl k' >>~/.bashrc
     ```

     * Note: bash-completion sources all completion scripts in `/etc/bash_completion.d`.

     - come back to this....

## kubectl run & Generators

`kubectl run --restart=Never`//pod 

`kubectl run --restart=OnFailure`//job

`kubectl run --restart=OnFailure --schedule=""`

`kubectl run --restart=OnFailure --schedule="30 21 * * *"`//cronjob

`--labels="k1=v1,k2=v2"` Adding labels to the resource being created

`--env="k1=v1" --env="k2=v2"` Adding simple environment variables in form of key value pairs
Specify arguments to the container using `-- /bin/sh -c "ls -l /etc/passwd"`

## Intelligent Bookmarks

### How to Create a Bookmark That Jumps to Specific Text on a Website

https://lifehacker.com/how-to-create-a-bookmark-that-jumps-to-specific-text-on-1844113624

  - Link to Text Fragment => https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg/related

- you are allowed to open kubernetes documentation => `bookmark the important pages beforehand`

 * - `bookmark the actual anchor of the page where a relevant code snippet` is given !!!!

  - ex:

    `https://kubernetes.io/docs/tasks/configure-pod-container/configure-volume-storage/#configure-a-volume-for-a-pod`//configure a Pod to use Volumes and define volumeMounts at container level and define volumes in spec

    - no point bookmarking (use Chrome) the top of the page and then searching on the page — you simply don’t have the time !

    - Get familiar w/ `kubectl explain` command or get used to using the `Reference API Docs` — you may get a question about `creating a CronJob` and `making sure it is active before a certain time otherwise kubernetes may terminate it` — you should know how to find out that property and where it should come while defining your CronJob.

## Resources to Practice

- This `CKAD course on Udemy by Mumshad` =>  try doing the mock exams at the end of course, in half hour instead of one

- Practice your command line skills => `https://github.com/dgkanatsios/CKAD-exercises`

- `13 weekly challenges by Kim Wuestkamp` that would help you dig deeper and troubleshoot some problems => `https://codeburst.io/kubernetes-ckad-weekly-challenges-overview-and-tips-7282b36a2681`

* - If possible, `complete all the relevant “Tasks”` => `https://kubernetes.io/docs/tasks/` given on the `kubernetes documentation` — if short on time do at least the ones given `here` => `https://github.com/twajr/ckad-prep-notes#tasks-from-kubernetes-doc`

- Practice Enough With These 150 Questions for the CKAD Exam => https://medium.com/bb-tutorials-and-thoughts/practice-enough-with-these-questions-for-the-ckad-exam-2f42d1228552

## More Tips

- Always `remember to set the right namespace` before you attempt the question. `If` namespace is not given use the `default namespace` but you `still need to set it as the earlier question might have forced you to use a different namespace`. Set it using `k config set-context --current --namespace=dev`

- Create files like 2-dep.yaml , 4-pod.yaml or 9-svc.yaml for the resources you create and associate them with the question numbers so that you can always come back to the right file, if required at a later stage.

- Only use `“Google Chrome”` for the exam — + `make sure you have those bookmarks in Chrome` !

- Learn how to `inspect the logs of a pod`, `describe a resource and grep` for useful information and other debugging aspects. Like `to fix a broken service (with no endpoints)`, first `check that the labels that the service intend to match are actually the label that Pod exposes`. Next check if `service’s targetPort is same as Pod’s containerPort` etc.

- Some situations may require you to get details of a running but broken Pod or Deployment by running a command like `k get po nginx -o yaml > nginx-po.yaml` and then making relevant changes and deploy them via `kaf nginx-pod.yaml` Note that you `might have to delete the broken pod first before you could apply` your changes....but....official Kubernetes test tips say that file may get deleted automatically upon pod (etc...) deletion??? Look into this...

- Also I have read at multiple places that `people were not able to copy more than a couple of lines from documentation to the terminal` — not true for my case — was easily able to copy entire YAML for PersistentVolumeClaim and the like.????????


## Deprecations in 1.19

???

https://medium.com/faun/be-fast-with-kubectl-1-18-ckad-cka-31be00acc443


```yaml
k exec my-pod ls # still works in 1.18, but deprecated
k exec my-pod -- ls # better use this
```

## CKA CKAD Simulator

 https://killer.sh/

## Kubernetes CKAD Example Exam Questions Practical Challenge Series

https://codeburst.io/kubernetes-ckad-weekly-challenges-overview-and-tips-7282b36a2681
