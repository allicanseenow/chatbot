var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

var clients = 0;
io.on('connection', function(socket) {
  clients++;
  socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
  socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
  socket.on('disconnect', function () {
    clients--;
    socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
  });
});

var nsp = io.of('/np');
nsp.on('connection', (socket) => {
  console.log('Someone connected');
  nsp.emit('hi', 'Hello everyone!');
});

server.listen(3000, function() {
  console.log('listening on localhost:3000');
});