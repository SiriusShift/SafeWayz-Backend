const {Server} = require("socket.io");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow frontend access (Update this for security)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;