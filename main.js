
var current_room_id = 0;
var socket = io();
var room_list = [];

socket.on('room_list_update', function(data) {
  html_room_list_update(data.room_list)
})

function html_room_list_update(room_list) {
  var element = document.getElementById('main-ul-room-list');
  var html = ''

  for (var i = 0; i < room_list.length; i++) {
    var room = room_list[i];
    html += `
    <li key='${room.id}'>
      ${room.id}
      <button class='main-button-room-join' roomId='${room.id}'>Join</button>
    </li>`
  }

  element.innerHTML = html;
  var el_list = document.getElementsByClassName('main-button-room-join')

  for (var i = 0; i < el_list.length; i++) {
    el_list[i].addEventListener('click', function(e) {
      e.preventDefault();
      var room_id = e.target.getAttribute('roomId')
    })
  }
}

function init() {
  console.log('this is main.js')
  // event listener
  document.getElementById('main-button-room-create').addEventListener('click', function(e) {
    e.preventDefault();

    socket.emit('room_list_create', 'test message');
  })
}


init()
