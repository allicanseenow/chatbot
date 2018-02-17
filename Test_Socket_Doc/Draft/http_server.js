var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

function handler(req, res) {
  fs.readFile(__dirname + '/http_server.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading html file');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', (socket) => {
  // Emit an event
  socket.emit('news', {hello: 'world'});
  // Register a new handler for the given event.
  socket.on('other event', (data) => {
    console.log("data In server ", data);
  })
})
