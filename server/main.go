package main

import (
	"context"
	"log"
	"net"

	pb "github.com/mmitou/grpc-web-demo/proto"
	"google.golang.org/grpc"
)

type echoServer struct {
}

func (s *echoServer) Echo(ctx context.Context, req *pb.EchoRequest) (*pb.EchoResponse, error) {
	res := &pb.EchoResponse{Message: req.Message + req.Message}
	return res, nil
}

func main() {
	lis, err := net.Listen("tcp", ":8080")
	if err != nil {
		log.Fatal(err)
	}

	server := grpc.NewServer()
	pb.RegisterEchoServiceServer(server, &echoServer{})
	server.Serve(lis)
}
