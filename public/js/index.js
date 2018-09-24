var socket = io();

// 'connect' built in event listener for connection
socket.on('connect', function () {
  console.log('Connected to server');
});

// Display newMesssage sent from Server
socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

});

// Display newLocationMessage from Server
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // Use html() to get actual html content defined in template
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url,
  });
  jQuery('#messages').append(html);

  // Prior to use of Mustache Templates HTML was to add via jQuery - see lines below
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current Location</a>');
  //
  // li.text(`${message.from} ${formattedTime}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);

})

socket.on('disconnect', function ()  {
  console.log('Disconnected from server');
});


// Create and send clients messagee to server when use clicks "Send" button
// Also handles clearing the content of messageTextBox after sent
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

// Generates a message containing user location to Server when user clicks "Send location" button
// It checks to see if user's browser supports geolocation,
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  // Does user's browser even support geolocation - some older browsers don't
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  // Disable button while location is being retrieved to prevent user from
  // clicking it again because they think request hasn't been sent
  locationButton.attr('disable', 'disabled').text('Sending location..');

  // Get the users current location - Lattitude and Longitude
  navigator.geolocation.getCurrentPosition(function (position) {
    // Now that location response received re-enable button
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', { //success handler
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

  // Sharing geolocation requires user to first allow it...if they haven't allowed
  // it then create an alert letting them no app can't get geolocation until they allow it.
  }, function() {   //error handler
    // Re-enable locationButton so user can try it again if desired
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
