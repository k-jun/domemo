export class Room {
	constructor() {
		this.users = []
		this.tiles = []
	}

	join(socket) {
		this.users.push({
			id: socket.id,
			name: "",
			tiles: [],
			socket: socket,
		});
	}

	leave(socket) {
		let idx = -1;
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].id == socket.id) {
				idx = i;
			}
		}
		if (idx != -1) {
			this.users.splice(idx, 1);
		}
	}

	refresh() {
		const payload = {
			tiles: this.tiles,
			users: this.users.map((x) => ({
				id: x.id,
				name: x.name,
				tiles: x.tiles,
			})),
		};

		for (let i = 0; i < this.users.length; i++) {
			this.users[i].socket.emit("refresh", payload);
		}
	}

	error(message) {
		const payload = { message };

		for (let i = 0; i < this.users.length; i++) {
			this.users[i].socket.emit("error", payload);
		}
	}

	rename(socket, name) {
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].id == socket.id) {
				this.users[i].name = name;
			}
		}
	}

	open({userId, tileIdx}) {
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].id == userId) {
				this.users[i].tiles[tileIdx].isOpen = true
			}
		}
	}

	GameStart() {
		let hand_num = 0, open_num = 0, max_num = 0
		switch (this.users.length) {
			case 2:
				hand_num = 7, open_num = 7, max_num = 7
				break;
			case 3:
				hand_num = 7, open_num = 0, max_num = 7
				break;
			case 4:
				hand_num = 5, open_num = 4, max_num = 7
				break;
			case 5:
				hand_num = 4, open_num = 4, max_num = 7
				break;
			case 6:
				hand_num = 4, open_num = 6, max_num = 8
				break;
			case 7:
				hand_num = 5, open_num = 4, max_num = 9
				break;
			default:
				this.error("the amount of users must be between 2 and 7")
				return
		}

		const nums = deck(max_num)
		for (var i = 0; i < this.users.length; i++) {
			const a = nums.splice(0, hand_num)
			this.users[i].tiles = a.map(x => ({ name: x, isOpen: false }))
		}
		this.tiles = nums.map((x, i) => ({ name: x, isOpen: (i < open_num ? true : false) }))
		return ""
	}
}

export function deck(max_num) {
	let nums = []
	for (let i = 1; i <= max_num; i++) {
		for (let j = 1; j <= i; j++) {
			nums.push(i);
		}
	}

	// https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A3%E3%83%83%E3%82%B7%E3%83%A3%E3%83%BC%E2%80%93%E3%82%A4%E3%82%A7%E3%83%BC%E3%83%84%E3%81%AE%E3%82%B7%E3%83%A3%E3%83%83%E3%83%95%E3%83%AB
	for (let i = nums.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let x = nums[i];
		nums[i] = nums[j];
		nums[j] = x;
	}
	return nums
}