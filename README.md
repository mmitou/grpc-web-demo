# grpc-webでistioをインストールしたkubernetesクラスタ上のgRPCサーバーと通信してみよう

## 概要
- webブラウザからgRPCサーバーにリクエストを投げるには、gRPCサーバーとwebブラウザの間にenvoy等のgRPC proxyが必要です。
- envoyは、kubernetesクラスタにインストールしたistioを適切に設定する事で、PODに対して自動的に挿入する事が出来ます。
- この記事では、そのistioによって挿入されたenvoyに対してgRPC proxyとして動作するように設定する例を紹介します。


## 目次
1. gRPCサーバーを作る
2. webブラウザ上で実行するgRPCクライアントを作る
3. gRPCサーバーをkubernetes上にデプロイする
4. 実行してみる


