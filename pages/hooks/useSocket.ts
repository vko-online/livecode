import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"

const useSocket = (roomId, userId) => {
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => {
    const _socket = io('http://localhost:3001', {
      auth: {
        roomId,
        userId
      }
    });
    setSocket(_socket)
    return () => {
      _socket.close();
    }
  }, [roomId, userId])

  return socket
}

export default useSocket