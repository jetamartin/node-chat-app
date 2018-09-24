// Node Module that allows you to create a 'direct' path w/o '../' appearing in address
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
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
      // Callback is acknowledgement back to client that message was received
      // it can be used to transmit error information back to client re: createLocationMessage
      // that the client sent to server
      callback();
  });
  
  // When server receives a createLocationMessage from client containing location info (Lat  Long)
  // It builds a newLocationMessage containing a link to google map poiting to the location
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

// Note calling app.listen actually creates a server
server.listen(port, () => {
  console.log(`Started on port ${port}`);
})
