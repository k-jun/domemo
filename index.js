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
  console.log(`current member mumber is ${room.members.length}`)

  socket.on('start', function() {
    room.start();

    for (var i = 0; i < room.members.length; i++) {
      var hands = Array.from(room.hands)
      var my_hand = []
      for (var j = 0; j < room.hands[i].length; j++) {
        my_hand.push(' ')
      }
      hands[i] = []
      var opponent_hands = hands
      room.members[i].emit('started', { field: room.field, opponent_hands: opponent_hands, my_hand: my_hand })
    }
  })

  socket.on('push-down', function(payload) {
    console.log(payload)
  })

  socket.on('disconnect', function() {
    room.leave(socket);
  })
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
