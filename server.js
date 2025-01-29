require("dotenv").config();
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Mount api routes
app.use("/api", require("./routes/communication"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/role"));
app.use("/api", require("./routes/projects"));
app.use("/api", require("./routes/workingHours"));

// Use the router for handling routes
app.use(router);

app.listen(process.env.SERVER_PORT, () => {
  console.log("Backend Server running on " + process.env.SERVER_PORT);
});
