const express = require("express");
const cors = require("cors");
const { runRouters } = require("./routes");
const session = require("express-session");
const { sessionConfig } = require("./config/sessionConfig");
require("./config/runDb");
// require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

app.get("/", (req, res) => {
  res.send("API is running...");
});

runRouters(app);

const port = 5000; // Fallback to 3000 if not set
const host = process.env.HOST
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(port, host, () => console.log(`Server running on port ${port}`));
