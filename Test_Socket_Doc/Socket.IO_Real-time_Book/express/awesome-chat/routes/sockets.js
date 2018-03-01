var io = require('socket.io');

exports.initialize = (server) => {
  console.log("LISTENINGNGN")
  io = io.listen(server);

  let chatInfra = io.of('/chat_infra')
    .on('connection', (socket) => {
      socket.on('set_name', (data) => {
        socket.emit('name_been_set', data);
        // Tell the server to say welcome to THIS USER ONLY
        socket.send(JSON.stringify({
          type: 'serverMessage',
          message: 'Welcome to the chat room!',
        }));
        // Signify all other users EXCEPT THIS ONE that there is a new user
        socket.broadcast.emit('user_entered', data);
      });
    });
  let chatCom = io.of('/chat_com')
    .on('connection', (socket) => {
      socket.on('message', (message) =>{
        message = JSON.parse(message);
        console.log("MEssage in chatCom", message)
        if (message.type === 'userMessage') {
          if (message.name) {
            message.username = message.name;
            socket.broadcast.send(JSON.stringify(message));
            message.type = 'myMessage';
            socket.send(JSON.stringify(message));
          }
        }
      });
    });
}