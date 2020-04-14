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
  update_status();

  socket.on('start', function() {
    room.start();
    update_board()
  })

  socket.on('name_update', function(newName) {
    room.name_update(socket, newName)
    update_board();
    update_status();
  })


  socket.on('push-down', function(payload) {
    room.pushDown(payload.playerIdx, payload.cardIdx)
    update_board()
  })

  socket.on('disconnect', function() {
    room.leave(socket);
    update_status();
  })
});


function update_status() {
  for (var i = 0; i < room.members.length; i++) {
    room.members[i].emit('update_status', { 'status': `current members: ${room.members.length}, current viewers: ${room.viewers.length}, you are: player ${i + 1} your name is: ${room.names[i]}` })
  }

  for (var i = 0; i < room.viewers.length; i++) {
    room.viewers[i].emit('update_status', { 'status': `current members: ${room.members.length}, current viewers: ${room.viewers.length}, you are viewer: ${i + 1}` })
  }

}

function update_board() {
  for (var i = 0; i < room.members.length; i++) {
    var hands = Array.from(room.hands)
    var hands_status = Array.from(room.hands_status)
    var my_hand = []
    if (room.hands.length > i) {
      for (var j = 0; j < room.hands[i].length; j++) {
        if (room.hands_status[i][j]) {
          my_hand.push(room.hands[i][j])
        } else {
          my_hand.push(' ')
        }
      }
    }
    hands[i] = []
    hands_status[i] = []
    // var names = []
    // for (var j = 0; i < room.names.length; i++) {
    //   names.push(`${j + 1}. ${room.names[j]}`)
    // }

    room.members[i].emit(
      'updated',
      {
        field: room.field,
        opponent_hands: hands,
        opponent_hands_status: hands_status,
        my_hand: my_hand,
        names: room.names
      })
  }


  for (var i = 0; i < room.viewers.length; i++) {
    room.viewers[i].emit(
      'updated',
      {
        field: room.field,
        opponent_hands: room.hands,
        opponent_hands_status: room.hands_status,
        my_hand: [],
        names: room.names
      }
    )
  }
}

http.listen(3000, function() {
  console.log('listening on *:3000');
});
