var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/room.html`);
});

var roomno = 1;

io.on('connection', (socket) => {
  //Increase roomno 2 clients are present in a room.
  if (io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
  socket.join(`room-${roomno}`);

  // Send event to everyone
  io.sockets.in(`room-${roomno}`).emit('connectToRoom', { data: `You are in room no. ${roomno}`, room: io.nsps['/'].adapter.rooms["room-"+roomno] });

  socket.on('disconnect', function() {
    socket.leave(`room-${roomno}`);
    socket.broadcast.emit('leave', `One person at room id  ${socket.id} has left`);
  });
});

server.listen(3000, function() {
  console.log('listening on localhost:3000');
});