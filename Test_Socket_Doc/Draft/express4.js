var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/express4.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/express4.html');
});

app.get('/news', (req, res) => {
  res.sendFile(__dirname + '/express4.html');
});

io.on('connection', (socket) => {
  console.log( 'User ' + socket.id + ' connected' );
  socket.emit('server', 'Hello from the server!!', socket.id);
  socket.on('client', (msg) => {
    console.log(`In SERVER: User "${this.id}" sent message "${msg}"`);
  });

  // SENDING A MESSAGE TO EVERYONE IN THE NAMESPACE

  socket.on('tellEveryone', (msg) => {
    io.emit('heyEveryone', msg, socket.id);
    // === io.sockets.emit('heyEveryone', msg, socket.id);
    // === io.of('/').emit(...);      // of(''): reference other namespaces
  });

  socket.on('tellNamespace', (msg, namespaceName) => {
    io.of(namespaceName).emit('heyEveryone', msg, socket.id);
  });

  // ROOM

  socket.on('tellRoom', (msg, roomName) => {
    socket.to(roomName).emit('heyThere', msg, socket.id);
  });

  socket.on('private msg', (from, msg) => {
    console.log(`I have received a private message from ${from} saying ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log("Hey, it's doom");
    io.emit('user disconnected');
  });
});

var chat = io
  .of('/chat')
  .on('connection', (socket) => {
    socket.emit('a message', {
      msg: 'that only /chat will get',
    });
    socket.on('msg', (from, msg) => {
      console.log(`I have received a private message from ${from} saying ${msg}`);
    });
    chat.emit('a message', {
      msg: 'everyone in /chat will get',
    });
  });

var news = io
  .of('/news')
  .on('connection', (socket) => {
    socket.emit('item', { news: 'item'});
  });


