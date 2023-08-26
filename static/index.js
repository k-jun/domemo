import { h, text, app } from "https://unpkg.com/hyperapp";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

let path = "/socket.io"
if (window.location.pathname !== '/') {
  path = `${window.location.pathname}socket.io`
}
const socket = io(window.location.origin, { path });

const onChange = (state, event) => {
  socket.emit("rename", event.target.value);
  return { ...state, username: event.target.value };
};

const onReset = (state) => {
  socket.emit("reset");
  return { ...state };
};

const onOpen = (state, payload) => {
  socket.emit("open", payload);
  return { ...state };
}

const Tile = ({ name, isOpen, isRed, onclick }) => {
  return h("div", {
    style: {
      margin: '10px',
      height: '100px',
      width: '60px',
      background: 'black',
      fontSize: '50px',
      borderRadius: '3px',

      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: isRed ? "red" : "white"
    },
    onclick
  }, text(isOpen ? name : ""))
}

const Board = ({ users, tiles }) => {
  return h("div", {}, [
    h("h3", {}, text("Field")),
    h("div", { style: { display: "flex", flexDirection: "row" } }, tiles.map(x => Tile({ ...x }))),
    h("div", {}, users.filter(x => x.id != socket.id).map((u, uidx) => {
      return h("div", {}, [
        h("h3", {}, text(u.name)),
        h(
          "div",
          { style: { display: "flex", flexDirection: "row" } },
          u.tiles.map((t, tidx) => Tile({ ...t, isRed: t.isOpen, isOpen: true, onclick: [onOpen, { userId: u.id, tileIdx: tidx }] }))
        ),
      ])
    })),
    h("h3", {}, text("Myself")),
    h("div", { style: { display: "flex", flexDirection: "row" } }, users.find(x => x.id == socket.id).tiles.map(x => Tile({ ...x, isRed: x.isOpen }))),
  ])
}

const dispatch = app({
  init: { username: "", users: [], tiles: [] },
  view: ({ username, users, tiles }) =>
    h("main", {}, [
      h("h1", {}, text("Domemo")),
      h("div", { display: "flex", flexDirection: "row" }, [
        text(`username:`),
        h("input", {
          type: "text",
          onchange: onChange,
          placeholder: "enter username",
          value: username,
          style: { backgroundColor: "#ddd", margin: "0 5px" },
        }),
        h("button", { onclick: onReset }, text("reset")),
      ]),
      h("div", { display: "flex", flexDirection: "row" }, [
        text(
          `players: ${users
            .map((u) => u.name)
            .join(", ")} `
        ),
      ]),

      username && Board({ users, tiles }),
    ]),
  node: document.getElementById("app"),
});

const Refresh = (state, payload) => {
  return { ...state, ...payload };
};

socket.on("refresh", (payload) => {
  dispatch(Refresh, payload);
});

socket.on("error", (payload) => {
  alert(payload.message)
});
