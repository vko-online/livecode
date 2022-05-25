// import { Server } from "socket.io";
const { Server } = require('socket.io')

const io = new Server(3001, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true
  }
});

const rooms = new Map()
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
