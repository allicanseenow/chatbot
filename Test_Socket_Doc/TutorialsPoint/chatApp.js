var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/chatApp.html`);
});

var users = [];
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('setUsername', (data) => {
    console.log("Data is ", data)
    console.log("USER IS ", users)
    console.log("INDEX OF ", users.indexOf(data))
    if (users.indexOf(data) === -1) {
      users.push(data);
      socket.emit('userSet', {username: data});
    }
    else {
      socket.emit('userExists', data + ' username is taken');
    }
  });

  socket.on('msg', (data) => {
    io.sockets.emit('newmsg', data);
  });
});

http.listen(3000, () => {
  console.log('Listening on 3000');
});