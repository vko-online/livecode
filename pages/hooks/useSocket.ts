import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"
import { websocketUrl } from "../../lib/config";

const useSocket = (roomId, userId) => {
  const [socket, setSocket] = useState<Socket>()
  useEffect(() => {
    const _socket = io(websocketUrl, {
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