
var current_room_id = 0;
var socket = io();
var room_list = [];

function init() {
  // event listener
  document.getElementById('game-start').addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit('start', {})
  })

  document.getElementById('name-input').addEventListener('change', function (e) {
    e.preventDefault();
    socket.emit('name_update', e.target.value)
  })
}

socket.on('update_status', function (payload) {
  console.log(payload)
  document.getElementById('status').innerText = payload.status
})

socket.on('updated', function (payload) {

  var opponent_hands_status = payload.opponent_hands_status
  var opponent_hands = payload.opponent_hands
  var names = payload.names

  var el_opponent_hands = document.getElementById('opponent-hands')
  var html_opponent_hands = ''
  for (var i = 0; i < opponent_hands.length; i++) {
    if (opponent_hands[i].length == 0) {
      continue
    }

    var html_player = `<div class='player-hand'><h4>${names[i]}</h4>`
    html_player += `<div class='hand'>`
    for (var j = 0; j < opponent_hands[i].length; j++) {
      html_player += `<div class='card opponent-card ${opponent_hands_status[i][j] && 'red'}' playerIdx='${i}' cardIdx='${j}'>${opponent_hands[i][j]}</div>`
    }
    html_player += '</div></div>'
    html_opponent_hands += html_player
  }

  var field = payload.field
  var el_field = document.getElementById('field')
  var html_field = ''
  for (var i = 0; i < field.length; i++) {
    html_field += `<div class='card'>${field[i]}</div>`
  }

  var my_hand = payload.my_hand
  var el_my_hand = document.getElementById('my-hand')
  var html_my_hand = ''
  for (var i = 0; i < my_hand.length; i++) {
    html_my_hand += `<div class='card red'>${my_hand[i]}</div>`
  }

  el_field.innerHTML = html_field
  el_opponent_hands.innerHTML = html_opponent_hands
  el_my_hand.innerHTML = html_my_hand


  var el_list = document.getElementsByClassName('opponent-card')
  for (var i = 0; i < el_list.length; i++) {
    el_list[i].addEventListener('click', function (e) {
      var playerIdx = e.target.getAttribute('playerIdx')
      var cardIdx = e.target.getAttribute('cardIdx')
      socket.emit('push-down', { playerIdx: playerIdx, cardIdx: cardIdx })
    })
  }
})

init()
