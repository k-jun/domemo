
var current_room_id = 0;
var socket = io();
var room_list = [];

function init() {
  // event listener
  document.getElementById('game-start').addEventListener('click', function(e) {
    e.preventDefault();
    socket.emit('start', {})
  })
}

socket.on('started', function(payload) {
  var opponent_hands = payload.opponent_hands
  var el_opponent_hands = document.getElementById('opponent-hands')
  var html_opponent_hands = ''
  for(var i = 0; i< opponent_hands.length; i++) {
    if (opponent_hands[i].length == 0) {
      continue
    }

    var html_player = `<h4>player ${i+1}</h4>`
    html_player += `<div class='player'>`
    for(var j = 0; j < opponent_hands[i].length; j++) {
      html_player += `<div class='card'>${opponent_hands[i][j]}</div>`
    }
    html_player += '</div>'
    html_opponent_hands += html_player
  }

  var field = payload.field
  var el_field = document.getElementById('field')
  var html_field = ''
  for (var i = 0; i < field.length; i++) {
    html_field += `<div class='card'>${field[i]}</div>`
  }

  var my_hand = payload.my_hand
  console.log(my_hand)
  var el_my_hand = document.getElementById('my-hand')
  var html_my_hand = ''
  for (var i = 0; i < my_hand.length; i++) {
    html_my_hand += `<div class='card'>${my_hand[i]}</div>`
  }
  console.log(html_my_hand)

  el_field.innerHTML = html_field
  el_opponent_hands.innerHTML = html_opponent_hands
  el_my_hand.innerHTML = html_my_hand


})


init()
