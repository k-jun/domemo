var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Room = require('./room.js');


var room = new Room();

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/main.js', function(req, res) {
  res.sendFile(__dirname + '/main.js');
});


io.on('connection', function(socket) {
  room.join(socket);
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
