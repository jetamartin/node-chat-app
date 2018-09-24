var socket = io();

// 'connect' built in event listener for connection
socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log("Got New Message", message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);

})

socket.on('disconnect', function ()  {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {   // Acknowledgement callback
    // Clear value in messageTextBox after message is submitted
    messageTextBox.val("");
  });
});
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  // Disable button while location is being retrieved to prevent user from
  // clicking it again because they think request hasn't been sent
  locationButton.attr('disable', 'disabled').text('Sending location..');
  navigator.geolocation.getCurrentPosition(function (position) {
    // Now that location response received re-enable button
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', { //success handler
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    console.log(position);
  }, function() {   //error handler
    // Re-enable locationButton so user can try it again if desired
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
