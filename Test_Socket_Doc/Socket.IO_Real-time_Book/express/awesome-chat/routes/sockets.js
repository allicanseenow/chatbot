var io = require('socket.io');

exports.initialize = (server) => {
  console.log("LISTENINGNGN")
  io = io.listen(server);
  // io.sockets.on === io.on
  io.on('connection', (socket) => {
    // socket.send(JSON.stringify({
    //   type: 'serverMessage',
    //   message: 'Welcome to the chat bot!',
    // }));
    // When user sends a message, server sends the response so the chat screen of each user displays the message
    socket.on('message', (message) => {
      message = JSON.parse(message);
      //
      if (message.type === 'userMessage') {
        if (socket.set_name) message.username = socket.set_name;
        console.log("SOCKET SET_name", socket.set_name);
        socket.broadcast.send(JSON.stringify(message));
        message.type = 'myMessage';
        socket.send(JSON.stringify(message));
      }
    });
    // Set name
    socket.on('set_name', (data) => {
      // socket.set() has been DEPRECATED
      // socket.set('nickname', data.name, function(){
      //   socket.emit('name_set', data);
      //   socket.send(JSON.stringify({type:'serverMessage',
      //     message: 'Welcome to the most interesting chat room on earth!'}));
      // });
      socket.set_name = data.name
      socket.emit('name_been_set', data);
      socket.send(JSON.stringify({ type: 'serverMessage', message: 'Welcome to the chat bot!' }))
    })
  })
}