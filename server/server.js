// Node Module that allows you to create a 'direct' path w/o '../' appearing in address
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const app = express();

var server = http.createServer(app);
var io = socketIO(server);

// Setup for Heroku -- if env variable present use it otherwise use 3000
const port = process.env.PORT || 3000;
// Express middleware express.static required to allow you to display static content
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
})

// Note calling app.listen actually creates a server
server.listen(port, () => {
  console.log(`Started on port ${port}`);
})
