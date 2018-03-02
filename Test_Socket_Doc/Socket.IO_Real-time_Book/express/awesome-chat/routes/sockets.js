var io = require('socket.io');

exports.initialize = (server) => {
  console.log("LISTENINGNGN")
  io = io.listen(server);
  let self = this;

  this.chatInfra = io.of('/chat_infra');
  this.chatInfra.on('connection', (socket) => {
    socket.on('set_name', (data) => {
      socket.emit('name_been_set', data);
      console.log("DATA in set_name is", data);
      // Tell the server to say welcome to THIS USER ONLY
      socket.send(JSON.stringify({
        type: 'serverMessage',
        message: 'Welcome to the chat room!',
      }));
      // Signify all other users EXCEPT THIS ONE that there is a new user
      // socket.broadcast.emit('user_entered', data);
    });
    socket.on('join_room', (room) => {
      console.log("REOOM SD----", room);
      if (room.roomName) {
        // Add the client to the room "room.name"
        socket.join(room.roomName);
        // New version of socket.io separated socket.id and socket.cliend.id
        // Basically, it added the namespace into the socket.id to make it become: "/namespace#id"
        // instead of only "id". This kinda broke a lot of stuff
        /*
            Compare these two:
              console.log("SOCKET ID IS ", socket.id);
              console.log("SOCKET IS ", socket.client.id);
         */
        let comSocket = self.chatCom.sockets[`${self.chatCom.name}#${socket.client.id}`];
        // Connect namespace 'chat_com' to this room via the 'socket.id'
        comSocket.join(room.roomName);
        // Set the room name when 'chat_com' connects to it
        comSocket.room = room.roomName;
        // Signify all other users EXCEPT THIS ONE that there is a new user in this room
        // socket.prototype.in === socket.prototype.to
        socket.in(room.roomName).broadcast.emit('user_entered', { roomName: room.roomName, userName: room.userName });
      }
    });
  });

  this.chatCom = io.of('/chat_com');
  this.chatCom.on('connection', (socket) => {
    socket.on('message', (message) =>{
      message = JSON.parse(message);
      console.log("MEssage in chatCom", message)
      if (message.type === 'userMessage') {
        if (message.name) {
          message.username = message.name;
          // Broadcast to all other users that this user has sent a new message
          socket.in(socket.room).broadcast.send(JSON.stringify(message));
          message.type = 'myMessage';
          socket.send(JSON.stringify(message));
        }
      }
    });
  });
};