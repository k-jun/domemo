var Room = require('./room.js')

module.exports = class Store {
  constructor() {
    this.rooms = []
    this.next_idx = 0
  }

  room_create() {
    var room_id = this.next_idx;
    var newRoom = new Room(room_id)
    this.next_idx += 1
    this.rooms.push(newRoom)
  }

  room_close(idx) {
    this.rooms.remove(idx)
  }
}
