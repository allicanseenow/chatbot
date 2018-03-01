var socket = io.connect('/');

socket.on('name_been_set', (data) => {
  $('#nameform').hide();
  $('#messages').append('<div class="systemMessage">' + 'Hello ' + data.name + '</div>');
  $('#send').click(() => {
    var data = {
      message: $('#message').val(),
      type:'userMessage'
    };
    socket.send(JSON.stringify(data));
    $('#message').val('');
  });
  socket.on('message', (data) => {
    console.log("Inside message event", data);
    data = JSON.parse(data);
    if (data && data.username) {
      $('#messages').append('<div class="' + data.type + '"><span class="name">' + data.username + ':</span> ' + data.message + '</div>');
    }
    else {
      $('#messages').append('<div class="' + data.type + '">' + data.message + '</div>');
    }
  });
  socket.on('user_entered', (user) => {
    $('#messages').append('<div class="systemMessage">' + user.name + ' has joined the room.' + '</div>');
  });
});

$(function(){
  $('#setname').click(() => {
    socket.emit('set_name', {name: $('#nickname').val()});
  });
});