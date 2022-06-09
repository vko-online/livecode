import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../lib/server-io";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};
const rooms = new Map();

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      cors: {
        origin: ["http://localhost:3000", "https://livecode.kz", "https://livecode-kz.herokuapp.com"],
        credentials: true
      },
      path: "/api/socketio",
    });
    
    io.on("connection", (socket) => {
      const activeUserId = socket.handshake.auth['userId']
      const activeRoomId = socket.handshake.auth['roomId']

      if (activeRoomId) {
        socket.join(activeRoomId)
        if (!rooms.has(activeRoomId)) {
          rooms.set(activeRoomId, [activeUserId])
        } else {
          const members = rooms.get(activeRoomId)
          rooms.set(activeRoomId, [...members, activeUserId])
        }
        io.to(activeRoomId).emit('joined_room', activeUserId)
      }

      socket.on('input_cursor_position', (data) => {
        io.to(activeRoomId).except(activeUserId).emit('cursor_position', {
          position: data,
          userId: activeUserId
        })
      })

      socket.on('input_code_change', (data) => {
        io.to(activeRoomId).emit('code_change', data)
      })
      // socket.on('join_room', () => {
      //   if (rooms.has(roomId)) {
      //     const members = rooms.get(roomId)
      //     rooms.set(roomId, [...members, userId])
      //   } else {
      //     rooms.set(roomId, [userId])
      //   }
      //   io.to(roomId).emit('joined_room', userId)
      // })

      socket.on('leave_room', ({ roomId, userId }) => {
        if (rooms.has(roomId)) {
          const members = rooms.get(roomId)
          if (members.includes(userId)) {
            rooms.set(roomId, members.filter(v => v !== userId))
          } else {
            rooms.delete(roomId)
          }
        }
      })

      socket.on('disconnect', () => {
        io.to(activeRoomId).emit('left_room', activeRoomId)
        if (rooms.has(activeRoomId)) {
          const members = rooms.get(activeRoomId)
          if (members.includes(activeUserId)) {
            rooms.set(activeRoomId, members.filter(v => v !== activeUserId))
          } else {
            rooms.delete(activeRoomId)
          }
        }
      })
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default handler
