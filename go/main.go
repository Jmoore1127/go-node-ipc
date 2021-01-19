package main

import (
	"bufio"
	"log"
	"net"
)

const (
	SockAddr = "localhost:54321"
)

func main() {
	log.Printf("Starting tcp server on %s", SockAddr)
	l, err := net.Listen("tcp", SockAddr)
	if err != nil {
		log.Fatal("Error listening:", err)
	}
	defer l.Close()

	for {
		c, err := l.Accept()
		if err != nil {
			log.Fatal("Error connecting:", err)
			return
		}
		log.Print("Client connected")

		log.Printf("Client %s connected", c.RemoteAddr().String())

		go handleConnection(c)
	}
}

func handleConnection(conn net.Conn) {
	buffer, err := bufio.NewReader(conn).ReadBytes('\f')

	if err != nil {
		log.Print("Client left")
		conn.Close()
		return
	}

	log.Printf("Client message: %s", string(buffer[:len(buffer)-1]))

	conn.Write(buffer)

	handleConnection(conn)
}
