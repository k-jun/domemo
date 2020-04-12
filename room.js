
module.exports = class Room {
  constructor(id) {
    this.members = []
  }

  join(socket) {
    this.members.push(socket)
  }

  start() {

  }
}

