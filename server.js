const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api", reportRoutes);

// simple health-check route for AWS
app.get("/", (req, res) => {
  res.send("Armor backend running 🛡️");
});

// listen on all interfaces so Elastic Beanstalk can reach it
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () =>
  console.log(`🚀 Server running at http://${HOST}:${PORT}`)
);

