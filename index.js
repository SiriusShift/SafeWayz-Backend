const express = require("express");
const cors = require("cors");
const { runRouters } = require("./routes");
const session = require("express-session");
const { sessionConfig } = require("./config/sessionConfig");
const initializeSocket = require("./websocket");

require("./config/runDb");

// require("dotenv").config();

const app = express();
app.use(express.json({limit: "50mb"}));
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(session(sessionConfig));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const port = process.env.PORT || 5000; // Fallback to 3000 if not set
const host = process.env.URL
// app.listen(port, () => console.log(`Server running on port ${port}`));
const server = app.listen(5000, host, () => console.log(`Server running on port ${port} and host ${host}`));
const io = initializeSocket(server)
runRouters(app, io);
