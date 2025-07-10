const sokcetio = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = sokcetio(server, {
  cors: {
    origin: "*", // or your frontend domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("newMessage", (msg) => {
    // broadcast to others
    socket.broadcast.emit("newMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("WebSocket Server running on http://localhost:4000");
});
