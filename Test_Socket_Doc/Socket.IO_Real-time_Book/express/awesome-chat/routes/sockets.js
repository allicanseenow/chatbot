var io = require('socket.io');
var _ = require('lodash');
const util = require('util')

let roomList = {};

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
        // If the room hasn't been made before, create a new room and add it to the room list with the length (number of users) being 0
        // Else, increment the user count of this room by 1
        roomList[room.roomName] = roomList[room.roomName] ? roomList[room.roomName] + 1 : 1;
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
    socket.on('get_rooms', () => {
      // console.log('socket id is ', socket.id)
      // console.log('socket client id is ', socket.client.id)
      // io.sockets.in('chat_infra').adapter.clients((err, clients) => console.log('socket adapter client  ', clients))
      // console.log('io.sockets.adapter.nsp is ', io.sockets.in('chat_infra').adapter.nsp);
      // Main log------------------console.log('io.sockets.adapter.nsp.server.nsps chat_infra is ', util.inspect(io.sockets.in('chat_infra').adapter.nsp.server.nsps['/chat_infra'].adapter.rooms, {showHidden: false, depth: 2, colors: true, }));
      // console.log('io.sockets.adapter.rooms chat_infra is ', util.inspect(io.sockets, {showHidden: false, depth: 3, colors: true, }));
      // console.log('io.sockets.adapter.nsp.server.nsps chat_infra is ', io.sockets.in('chat_infra').adapter.nsp.server.nsps['/chat_infra']);
      // console.log('io.sockets.adapter.rooms is ', io.sockets.in('chat_infra').adapter.rooms);

      socket.emit('rooms_list', roomList);
    });
  });

  this.chatCom = io.of('/chat_com');
  this.chatCom.on('connection', (socket) => {
    socket.on('message', (message) =>{
      message = JSON.parse(message);
      console.log("MEssage in chatCom", message);
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
    // If the user disconnects, reduce the number of user in the room by 1
    socket.on('disconnect', (reason) => {
      // Check if this connection (socket) is actually in a room
      if (socket.room) {
        roomList[socket.room] -= 1;
        if (roomList[socket.room] === 0) delete roomList[socket.room];
      }
    });
  });
};