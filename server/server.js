// Node Module that allows you to create a 'direct' path w/o '../' appearing in address
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const app = express();

var server = http.createServer(app);
var io = socketIO(server);

// Setup for Heroku -- if env variable present use it otherwise use 3000
const port = process.env.PORT || 3000;
// Express middleware express.static required to allow you to display static content
app.use(express.static(publicPath));

// io represents a group of sockets  otherwise
// curently connected socket as an argument to it's callback.
// socket represents a single connection
// 'connection' is built in event on server
io.on('connection', (socket) => {
  console.log('New user connected');
  // When a new user connects to server. Server will send Welcome
  // message to just that user (not others) via socket.emit.
  // NOTE: socket.emit only emits to a single socket
  socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
  // When a new user connects other user will be notified with
  //'New user has joined' message. The new user will not receive this message
  // NOTE: this is enabled by socket.broadcast.emit() as it broadcast to every
  // user except the current broadcast.
  socket.broadcast.emit('newMessage', generateMessage('Admin','New user has joined chat'));


  // Server is listening to 'createMessage' event
  // Once it is recieved it logs it and then transmits it to every user
  // including the sending user.
  // NOTE: io.emit() sends event to EVERY socket (user)
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    // NOTE: io.emit - Emits event to every connection
      io.emit('newMessage', generateMessage(message.from, message.text));
      callback('This is from the server');
  });

    // Code below would transmit message to every user but the sending user's socket
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // })
// });

  // socket.on('createEmail', (newEmail) => {
  //   console.log('createEmail', newEmail);
  // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

// Note calling app.listen actually creates a server
server.listen(port, () => {
  console.log(`Started on port ${port}`);
})
