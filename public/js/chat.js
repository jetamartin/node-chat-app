var socket = io();

/*
  If the number of messages is large enough so as to not all be visible on screen
  at the same time we want to auto scroll the user to the bottom of the screen so
  that they can see new incoming messages without having to manually scroll to them.
  However, if the user is looking back through older messages you don't want to
  auto scroll them to the bottom of the screen if a new message arrives while they
  are looking at old messages. That would be annoying.

  So the solution is to autoscroll to the bottom only if they are near the bottom
  of the screen (e.g., last message is not entirely in view).

  To calculate whether the we should scroll the user we need the folloiwing Heights
   - clientHeight - size of the physical viewable message window
   - scrollHeight - entire height of all messsages combined including those that
                    aren't viewable on screen at any one time.
   - scrollTop    - How far (in pixels) we've scrolled down into the messages.

   Note: because the last message (newMessage) has already been added by the
    time this function is called we will need to include the height of this message

    We also need to add in the height of the previously last message (lastMessageHeight)
    for the folloiwing reasons:

      1. for most of the cases, it scrolls down but sometimes it does not, meaning
       it is not consistent without the lastMessageHeight.

     2. it will neverscroll if you are viewing the second last message unless you
       add in lastMessageHeight.

*/

function scrollToBottom () {
  // **** Selectors Variables ******
  var messages = jQuery('#messages')
  // newMessage is selector for brand new message that was just added
  // We get the last item by using 'li:lastChild' selector
  var newMessage = messages.children('li:last-child');

  // innerHeight get height of item plus any padding we've applied via css
  var newMessageHeight = newMessage.innerHeight();

  // We need height of previously last message using .prev(). Moves you to previous to last item
  var lastMessageHeight = newMessage.prev().innerHeight();

  // ***** Heights Variables *****

  // Height of view window
  var clientHeight = messages.prop('clientHeight');

  // Total size of the messages (This Height may be much larger than view window)
  var scrollHeight = messages.prop('scrollHeight');

  // Distance user is scrolled down from the top
 var scrollTop = messages.prop('scrollTop');

 if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
   messages.scrollTop(scrollHeight);
 }

}

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

  scrollToBottom();
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
  scrollToBottom();


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
