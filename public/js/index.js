var socket = io();

// 'connect' built in event listener for connection
socket.on('connect', function () {
  console.log('Connected to server');

  socket.on('newMessage', function(message) {
    console.log("Got New Message", message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
  });

});


socket.on('disconnect', function ()  {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
