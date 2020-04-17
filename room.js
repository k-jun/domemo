
var max_member_num = 7
var min_member_num = 2

module.exports = class Room {
  constructor(id) {
    this.members = []
    this.viewers = []
    this.hands = []
    this.field = []
    this.hands_status = []
    this.names = []
  }

  join(socket) {
    if (this.members.length < max_member_num) {
      this.members.push(socket)
      this.names.push(`anonymous`)
    } else {
      this.viewers.push(socket)
    }
  }

  name_update(socket, new_name) {
    var idx = this.members.indexOf(socket);
    this.names[idx] = new_name
  }

  leave(socket) {
    var idx = this.members.indexOf(socket)
    var viewerIdx = this.viewers.indexOf(socket)

    if (idx > -1) {
      this.members.splice(idx, 1);
      this.names.splice(idx, 1);
    } else {
      if (viewerIdx > -1) {
        this.viewers.splice(viewerIdx, 1);
      }
    }

  }

  pushDown(playerIdx, cardIdx) {
    this.hands_status[playerIdx][cardIdx] = true;
  }

  start() {

    if (this.members.length < min_member_num) {
      return
    }
    var hands = []
    var field = []
    var hands_status = []

    switch (this.members.length) {
      case 1:
        [hands, field, hands_status] = assign(1, 7, 7, 7);
      case 2:
        [hands, field, hands_status] = assign(2, 7, 7, 7);
        break;
      case 3:
        [hands, field, hands_status] = assign(3, 7, 0, 7);
        break;
      case 4:
        [hands, field, hands_status] = assign(4, 5, 4, 7);
        break;
      case 5:
        [hands, field, hands_status] = assign(5, 4, 4, 7);
        break;
      case 6:
        [hands, field, hands_status] = assign(6, 4, 6, 8);
        break;
      case 7:
        [hands, field, hands_status] = assign(7, 5, 4, 9);
        break;
    }

    this.hands = hands
    this.hands_status = hands_status
    this.field = field

  }
}

function assign(human_num, hand_num, field_num, max_num) {
  var cards = []
  for (var i = 1; i <= max_num; i++) {
    for (var j = 1; j <= i; j++) {
      cards.push(i);
    }
  }

  var hands = []
  var field = []
  var hands_status = []

  shuffle(cards)

  for (var i = 0; i < human_num; i++) {
    hands.push(cards.splice(0, hand_num));
  }

  for (var i = 0; i < human_num; i++) {
    var newArray = Array(hand_num)
    newArray.fill(false)
    hands_status.push(newArray)
  }

  field = cards.splice(0, field_num);
  for (var i = 0; i < cards.length; i++) {
    field.push(' ');
  }
  return [hands, field, hands_status]

}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
