// Node Module that allows you to create a 'direct' path w/o '../' appearing in address
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const {generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

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

  // Request by a client to join a chatroom
  socket.on('join', (params, callback) => {
    // Check to make sure user name and chat room are valid
    if (!isRealString(params.name) || !isRealString(params.room)) {
      // Callback client with error message
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    // if user is already in a room they will be removed from other rooms before adding them to room below
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    var user = users.getUser(socket.id);
    if (user) {
      // When a new user connects to server. Server will send Welcome
      // message to just that user (not others) via socket.emit.
      // NOTE: socket.emit only emits to a single socket/user
      socket.emit('newMessage', generateMessage('Admin',`${user.name}, Welcome to the "${user.room}" chat room of the Chat App.`));

      // When a new user connects other users in the same chat room  will be notified with
      //'User X has joined' message. The new user will not receive this message
      // NOTE: this is enabled by socket.broadcast.to().emit() as it broadcast to every
      // user in the chatroom except the current user (id'd by it's socket)
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    }

    // callback client with no error message
    callback();
  });

  // Server is listening to 'createMessage' event
  // Once it is recieved it logs it and then transmits it to every user
  // including the sending user.
  // NOTE: io.emit() sends event to EVERY socket (user)
  socket.on('createMessage', (message, callback) => {
    // NOTE: io.emit - Emits event to every connection
      var user = users.getUser(socket.id);
      if (user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));

      }
      // Callback is acknowledgement back to client that message was received
      // it can be used to transmit error information back to client re: createLocationMessage
      // that the client sent to server
      callback();
  });

  // When server receives a createLocationMessage from client containing location info (Lat  Long)
  // It builds a newLocationMessage containing a link to google map poiting to the location
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user && coords) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));

    }
  })
});

// Note calling app.listen actually creates a server
server.listen(port, () => {
  console.log(`Started on port ${port}`);
})
