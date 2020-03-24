# grpc-web-demo

grpc-webでistioをインストールしたkubernetesクラスタ上のgRPCサーバーと通信してみよう

## 概要
- webブラウザからgRPCサーバーにリクエストを投げるには、gRPCサーバーとwebブラウザの間にenvoy等のgRPC proxyが必要です
- envoyは、kubernetesクラスタにインストールしたistioを適切に設定する事で、PODに対して自動的に挿入する事が出来ます
- この記事では、そのistioによって挿入されたenvoyに対してgRPC proxyとして動作するように設定する例を紹介します


## 目次
1. gRPCサーバーを作る
2. webブラウザ上で実行するgRPCクライアントを作る
3. gRPCサーバーをkubernetes上にデプロイする
4. 実行してみる

### 1. gPRCサーバーを作る

今回作るgRPCサーバーの仕様は以下の通りです。
- サーバーはmessageという文字列を受け取る
- サーバーは受け取ったmessageを2つ繋げた文字列を返す
	- 例: サーバーが"hello"を受け取ったら"hellohello"を返す
- Listening PORT 9000

コンパイルして実行します。
```
protoc -I proto proto/echo.proto --go_out=plugins=grpc:proto
go build -o echo-server server/main.go
./echo-server
```

サーバーが期待した通り実行出来る事を確認してみます。
```
$ grpcurl -proto proto/echo.proto -plaintext -d '{"message":"hello"}' localhost:9000 proto.EchoService.Echo
{
  "message": "hellohello"
}
```

dockerを使う場合には以下のように実行します。

```
docker build -f docker/server.Dockerfile -t echo-server .
docker run -d -p 9000:9000 echo-server
```

## 参考
[grpc-web-istio-demo](https://github.com/venilnoronha/grpc-web-istio-demo)
