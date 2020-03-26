# grpc-web-demo

### [English](./docs/en/README.md)

- Web開発においてREST APIを設計するのは大変な作業です。
- REST APIの代わりにgRPCを用いる事で、開発者の負担が減るかもしれません。
- このデモでは、Web開発でgRPCの導入を検討している方に対し、シンプルで理解しやすく実際に動かせるプログラムを提供します。

## 概要

- webブラウザからgrpc-webを使ってgRPCサーバーにリクエストを投げるには、gRPCサーバーとwebブラウザの間にenvoy等のgRPC proxyが必要です。
- envoyは、kubernetesクラスタにインストールしたistioを適切に設定する事で、PODに対して自動的に挿入する事が出来ます。
- このデモでは、そのistioによって挿入されたenvoyに対してgRPC proxyとして動作するように設定します。

## 目次

1. gRPCサーバーを作る
2. webブラウザ上で実行するgRPCクライアントを作る
3. gRPCサーバーをkubernetes上にデプロイする
4. 実行してみる
5. clean up

### 1. gPRCサーバーを作る

既にgRPCサーバーのimageをdockerhubにpushしてあります。
今回はこのimageを使います。

- [mmitou/echo-server](https://hub.docker.com/repository/docker/mmitou/echo-server)

このgRPCサーバーの仕様は以下の通りです。

- サーバーはmessageという文字列を受け取る
- サーバーは受け取ったmessageを2つ繋げた文字列を返す
	- 例: サーバーが"hello"を受け取ったら"hellohello"を返す
- Listening PORT 9000


gRPCサーバーをコンパイルする場合は以下のコマンドを実行します。

```
protoc -I proto proto/echo.proto --go_out=plugins=grpc:proto
go build -o echo-server server/main.go
```

コンテナimageは以下のようにして作ります。

```
docker build -f ./docker/server.Dockerfile -t mmitou/echo-server:v1 .
```

サーバーが期待した通り実行出来る事を確認してみます。

```
$ docker run --rm -d -p 9000:9000 mmitou/echo-server:v1
$ grpcurl -proto proto/echo.proto -plaintext -d '{"message":"hello"}' localhost:9000 proto.EchoService.Echo
{
  "message": "hellohello"
}
```

### 2. webブラウザ上で実行するgRPCクライアントを作る

こちらも既にimageをdockerhubにpushしてあります。
今回はこのimageを使います。

- [mmitou/web-ui](https://hub.docker.com/repository/docker/mmitou/web-ui)

クライアントは以下の手順でビルドします。

```
protoc -I proto/ proto/echo.proto \
	--js_out=import_style=commonjs:proto \
	--grpc-web_out=import_style=commonjs,mode=grpcwebtext:proto
docker build -f docker/web-ui.Dockerfile -t mmitou/web-ui:v1 .
```

### 3. gRPCサーバーをkubernetes上にデプロイする

GKEでkubernetesクラスターを作ってistioをインストールします。

```
gcloud beta container clusters create sample-cluster --preemptible --addons=Istio
gcloud container clusters get-credentials sample-cluster
```

以下のコマンドでkubernetesクラスターにアプリケーションをデプロイします。

```
kubectl label namespace default istio-injection=enabled
kubectl apply -f istio/server.yaml
kubectl apply -f istio/web-ui.yaml
kubectl apply -f istio/istio.yaml
```

Serviceのname port に"grpc-web"と書くのが重要です。<br />
istioはname portの値を見て、プロトコルを判断します。<br />
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

### 4. 実行してみる

以下のコマンドでistio-gatewayのIPアドレスを確認し、webブラウザでそのIPアドレスを開きます。

```
$ kubectl get service istio-ingressgateway -n istio-system
NAME                   TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                                                                                                                                      AGE
istio-ingressgateway   LoadBalancer   10.7.245.96   34.84.25.68   15020:32183/TCP,80:32561/TCP,443:30846/TCP,31400:31742/TCP,15029:32088/TCP,15030:31197/TCP,15031:31861/TCP,15032:31313/TCP,15443:30914/TCP   8m13s
```

以下のようにwebブラウザのコンソールに"hellohello"と表示されていれば成功です。

![Screenshot from 2020-03-26 13-29-51](https://user-images.githubusercontent.com/254112/77610860-3afa0580-6f67-11ea-8930-b2f3d59e94fd.png)


### 5. clean up

以下のコマンドを実行して、kubernetesクラスターを削除します。

```
gcloud container clusters delete sample-cluster
```

## 参考

[grpc-web-istio-demo](https://github.com/venilnoronha/grpc-web-istio-demo)
