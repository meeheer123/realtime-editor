const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { ACTIONS } = require("./src/Actions");

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
	return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
		(socketId) => {
			return {
				socketId,
				username: userSocketMap[socketId],
			};
		}
	);
}

io.on("connection", (socket) => {
	// console.log('a user connected', socket.id);
	socket.on("join", ({ roomId, username }) => {
		userSocketMap[socket.id] = username;
		socket.join(roomId);
		const clients = getAllConnectedClients(roomId);
		clients.forEach(({ socketId }) => {
			io.to(socketId).emit("joined", {
				clients,
				username,
				socketId: socket.id,
			});
		});
	});

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    io.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

	socket.on("disconnecting", () => {
		const rooms = [...socket.rooms];
		rooms.forEach((roomId) => {
			socket.in(roomId).emit("disconnected", {
				socketId: socket.id,
				username: userSocketMap[socket.id],
			});
		});
    delete userSocketMap[socket.id];
    socket.leave();
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
})
