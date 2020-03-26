# grpc-web-demo

[日本語](../../README.md)

- Designing a REST API in web development is a daunting task.
- Using gRPC instead of the REST API may reduce the burden on developers.
- In this demo, we will provide a simple, easy-to-understand program that can actually work for those who are considering implementing gRPC for web development.

## Abstract

- To request from a web browser to the gRPC server using grpc-web, a gRPC proxy such as envoy is required between the gRPC server and the web browser. 
- Envoy can be automatically inserted into PODs by properly configuring istio installed in a kubernetes cluster.
- In this demo, we will configure it to act as a gRPC proxy for the envoy inserted by its istio.

## table of contents

1. Building a gRPC server
2. Building a gRPC client that runs on a web browser
3. Deploying a gRPC server on kubernetes
4. Execution
5. clean up

### 1. Building a gRPC server

I've already pushed the image of the gRPC server to the dockerhub.
This time we'll use this image.

- [mmitou/echo-server](https://hub.docker.com/repository/docker/mmitou/echo-server)

The specifications of this gRPC server are as follows.

- The server receives a string. 
- The server returns a string which repeated the string recieved.
	- Example: If the server receives "hello", it returns "hellohello".
- Listening PORT 9000

To compile the gRPC server, run the following command.

```
protoc -I proto proto/echo.proto --go_out=plugins=grpc:proto
go build -o echo-server server/main.go
```

The container image is created as follows.
```
docker build -f ./docker/server.Dockerfile -t mmitou/echo-server:v1 .
```

Let's see if the server can do what we expect it to do.

```
$ docker run --rm -d -p 9000:9000 mmitou/echo-server:v1
$ grpcurl -proto proto/echo.proto -plaintext -d '{"message":"hello"}' localhost:9000 proto.EchoService.Echo
{
  "message": "hellohello"
}
```

### 2. Building a gRPC client that runs on a web browser

We have already pushed the image to the dockerhub too.
This time we'll use this image.

- [mmitou/web-ui](https://hub.docker.com/repository/docker/mmitou/web-ui)

The client is built in the following manner.

```
protoc -I proto/ proto/echo.proto \
	--js_out=import_style=commonjs:proto \
	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:proto
docker build -f docker/web-ui.Dockerfile -t mmitou/web-ui:v1 .
```

### 3. Deploying a gRPC server on kubernetes

Create a kubernetes cluster in GKE and install istio.

```
gcloud beta container clusters create sample-cluster --preemptible --addons=Istio
gcloud container clusters get-credentials sample-cluster
```

Deploy the application to the kubernetes cluster with the following command.

```
kubectl label namespace default istio-injection=enabled
kubectl apply -f istio/server.yaml
kubectl apply -f istio/web-ui.yaml
kubectl apply -f istio/istio.yaml
```

It is important to write "grpc-web" in the name port of the service.
The istio looks at the value of the name port to determine the protocol.

- [manual-protocol-selection](https://istio.io/docs/ops/configuration/traffic-management/protocol-selection/#manual-protocol-selection)

```
apiVersion: v1
kind: Service
metadata:
  name: server
  labels:
    app: server
spec:
  ports:
  - name: grpc-web # istio refers this value as protocol
    port: 9000
  selector:
    app: server
```

### 4. Execution

Check the IP address of the istio-gateway with the following command and open the IP address with a web browser.

```
$ kubectl get service istio-ingressgateway -n istio-system
NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                                                                                                                                      AGE
istio-ingressgateway   LoadBalancer   10.7.245.96   34.84.25.68   15020:32183/TCP,80:32561/TCP,443:30846/TCP,31400:31742/TCP,15029:32088/TCP,15030:31197/TCP,15031:31861/TCP,15032:31313/TCP,15443:30914/TCP   8m13s
```

If you see "hellohello" in your web browser's console as shown below, it's a success.

![Screenshot from 2020-03-26 13-29-51](https://user-images.githubusercontent.com/254112/77610860-3afa0580-6f67-11ea-8930-b2f3d59e94fd.png)

### 5. clean up

Run the following command to remove the kubernetes cluster.

```
gcloud container clusters delete sample-cluster
```
