const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

io.on('connection', socket => {
  console.log('user connected')

  socket.on('send_msg', (msg) => {
    console.log('message: ', msg);
    io.sockets.emit('sendback_msg', {id: Math.random(), msg: msg, userId: 1, userName: 'me'});
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Sockets listening on port ${port}`))