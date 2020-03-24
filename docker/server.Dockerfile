FROM golang:1.13 as builder
MAINTAINER Masayuki Ito <masayuki.itou.work@gmail.com>

WORKDIR /root/go/src/github.com/mmitou/grpc-web-demo/
COPY ./ .
RUN CGO_ENABLED=0 GOOS=linux go build -v -o echo-server server/main.go

FROM scratch
COPY --from=builder /root/go/src/github.com/mmitou/grpc-web-demo/echo-server /bin/
ENTRYPOINT [ "/bin/echo-server" ]
EXPOSE 9000
