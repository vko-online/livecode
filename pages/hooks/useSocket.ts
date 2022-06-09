import { useCallback, useEffect, useState } from "react";
import { io, Socket, connect } from "socket.io-client"
import { websocketUrl } from "../../lib/config";

const useSocket = (roomId, userId) => {
  const [socket, setSocket] = useState<Socket>()

  const socketInitializer = useCallback(async () => {
    await fetch('/api/socketio')
    const _socket = connect(process.env.BASE_URL, {
      path: "/api/socketio",
      auth: {
        roomId,
        userId
      }
    });
    // const _socket = io('/api/websocket', {
    //   auth: {
    //     roomId,
    //     userId
    //   }
    // })
    _socket.on('connect', () => {
      console.log('connected')
    })
    setSocket(_socket)
  }, [roomId, userId])

  useEffect(() => {
    socketInitializer()
  }, [socketInitializer])

  // useEffect(() => {
  //   const _socket = io(websocketUrl, {
  //     auth: {
  //       roomId,
  //       userId
  //     }
  //   });
  //   setSocket(_socket)
  //   return () => {
  //     _socket.close();
  //   }
  // }, [roomId, userId])

  return socket
}

export default useSocket