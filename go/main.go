package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"os"
)

const (
	SockAddr = "localhost:54321"
)

func main() {
	log.Printf("starting tcp server on %s", SockAddr)
	l, err := net.Listen("tcp", SockAddr)
	if err != nil {
		fmt.Printf("error listening: %s", err.Error())
		os.Exit(1)
	}
	defer l.Close()

	for {
		c, err := l.Accept()
		if err != nil {
			fmt.Printf("error connecting: %s", err.Error())
			os.Exit(1)
			return
		}

		fmt.Printf("client %s connected\n", c.RemoteAddr().String())

		go handleConnection(c)
	}
}

func handleConnection(conn net.Conn) {
	buffer, err := bufio.NewReader(conn).ReadBytes('\f')

	if err != nil {
		fmt.Print("client left\n")
		conn.Close()
		return
	}

	fmt.Printf("client message: %s\n", string(buffer[:len(buffer)-1]))
	fmt.Println("echoing message back to sender")

	conn.Write(buffer)

	handleConnection(conn)
}
