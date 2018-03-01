let chatInfra = io.connect('/chat_infra'),
  chatCom = io.connect('/chat_com');

chatInfra.on('name_been_set', (data) => {
  // Signify other users EXCEPT THIS ONE that there is a new user having entered the chat room
  chatInfra.on('user_entered', (user) => {
    $('#messages').append('<div class="systemMessage">' + user.name + ' has joined the room.' + '</div>');
  });
  // Welcome the new user to the chat box
  chatInfra.on('message', (message) => {
    let data = JSON.parse(message);
    $('#messages').append('<div class="' + data.type + '">' + data.message + '</div>');
  });

  chatCom.on('message', (message) => {
    let data = JSON.parse(message);
    console.log("Inside chatCOm message event", data);
    if (data && data.username) {
      $('#messages').append('<div class="' + data.type + '"><span class="name">' + data.username + ':</span> ' + data.message + '</div>');
    }
  })

  $('#nameform').hide();
  $('#messages').append('<div class="systemMessage">' + 'Hello ' + data.name + '</div>');
  $('#send').click(() => {
    // Don't declare this to be data = { name: data.name }, as this causes a name conflict
    let msg = {
      message: $('#message').val(),
      type:'userMessage',
      name: data && data.name,
    };
    chatCom.send(JSON.stringify(msg));
    $('#message').val('');
  });
});

$(function(){
  $('#setname').click(() => {
    chatInfra.emit('set_name', {name: $('#nickname').val()});
  });
});