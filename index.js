var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('chat message', (msg) => {
    console.log('Message ', msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});


// const express = require('express');
// // import express from 'express'
// const app = express();
//
//
//
// app.get('/', (req, res) => "Hello, world!")
// app.get('/trung', (req, res) => res.send('Is the best!'))
//
// app.get('/get_response', (req, res) => {
//     // Do something
//
//     res.json({
//         name: 'trung',
//     })
// })
//
// app.listen(3012, () => console.log('Example app listening on port 3000!'))