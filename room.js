
module.exports = class Room {
  constructor(id) {
    this.members = []
    this.status = 'waiting'
    this.hands = []
    this.field = []
  }

  join(socket) {
    this.members.push(socket)
  }

  leave(socket) {
    var idx = this.members.indexOf(socket)
    if (idx > -1) {
      this.members.splice(idx, 1);
    }
  }

  update() {

  }

  start() {
    // change card number depend on number of member
    var cards = []
    var hands = []
    var field = []
    for (var i = 1; i <= 7; i++) {
      for (var j = 1; j <= i; j++) {
        cards.push(i);
      }
    }

    switch (this.members.length) {
      case 2:
        [hands, field] = assign(cards, 2, 7, 7);
        break;
      case 3:
        [hands, field] = assign(cards, 3, 7, 0);
        break;
      case 4:
        [hands, field] = assign(cards, 4, 5, 4);
        break;
      case 5:
        [hands, field] = assign(cards, 5, 4, 4);
        break;
      default:
        break;
    }

    this.hands = hands
    this.field = field
    this.status = 'playing'

  }
}

function assign(cards, human_num, hand_num, field_num) {
  shuffle(cards)

  var hands = []
  var field = []
  for (var i = 0; i < human_num; i++) {
    hands.push(cards.splice(0, hand_num));
  }
  field = cards.splice(0, field_num);
  for(var i = 0; i < cards.length; i++) {
    field.push(' ');
  }
  return [hands, field]

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
