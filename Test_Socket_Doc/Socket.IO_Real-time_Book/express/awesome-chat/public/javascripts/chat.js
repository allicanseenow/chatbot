// Establish a single socket connection, multiplex the two namespaces over it.
let chatInfra = io.connect('/chat_infra'),
  chatCom = io.connect('/chat_com');

// location.search === query
let roomName = (
  // (.+?): Matches any character, one or many
  // &|$: Matches either '$' or end of string ($)
  (RegExp('room=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
);

// If there is a room name specified
if (roomName) {
  // Handler after user has entered the name to establish a session
  chatInfra.on('name_been_set', (data) => {
    chatInfra.emit('join_room', { roomName: roomName, userName: data.name });
    // Signify other users EXCEPT THIS ONE that there is a new user having entered the chat room
    chatInfra.on('user_entered', (data) => {
      $('#messages').append('<div class="systemMessage">' + data.userName + ' has joined the room ' + data.roomName + '.</div>');
    });
    // Welcome ONLY THIS new user to the chat box
    chatInfra.on('message', (message) => {
      let data = JSON.parse(message);
      $('#messages').append('<div class="' + data.type + '">' + data.message + '</div>');
    });
    // Receive the message by ANY USER
    chatCom.on('message', (message) => {
      let data = JSON.parse(message);
      if (data && data.username) {
        $('#messages').append('<div class="' + data.type + '"><span class="name">' + data.username + ':</span> ' + data.message + '</div>');
      }
    });

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
}

$(function(){
  $('#setname').click(() => {
    chatInfra.emit('set_name', {name: $('#nickname').val()});
  });
});