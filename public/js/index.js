var socket = io();
socket.on('connect', function () {
  console.log('Connected to server');

  socket.on('newMessage', function(message) {
    console.log("Got New Message", message);
  });

  socket.emit('createMessage', {
    from: 'Jet',
    text: 'Yea 6pm sounds fine'
  });
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey. This is Jet'
  // });
// })

  socket.on('disconnect', function ()  {
    console.log('Disconnected from server');
  });
})
