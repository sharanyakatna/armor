const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);

// ✅ Health + Root routes (for ALB + sanity check)
app.get("/", (req, res) => res.send("Armor backend root is working"));
app.get("/health", (req, res) => res.status(200).send("Armor backend is healthy"));

// ✅ Allow CORS (S3 + local + domain)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Middleware
app.use(bodyParser.json());

// ✅ API routes (your existing report routes)
app.use("/api", reportRoutes);

// ✅ Extra fallback route for AWS frontend (POST /verify-upi)
app.post("/verify-upi", async (req, res) => {
  try {
    const { upiId } = req.body;
    if (!upiId) return res.status(400).json({ error: "UPI ID required" });

    const Report = require("./models/Report");
    const report = await Report.findOne({ upiId });

    if (report) {
      return res.json({
        status: "⚠️ Reported as Fraudulent",
        description: report.description,
        reportedAt: report.reportedAt,
      });
    } else {
      return res.json({ status: "✅ Safe / Not Reported" });
    }
  } catch (error) {
    console.error("verify-upi error:", error);
    res.status(500).json({ error: "Server error while verifying UPI" });
  }
});

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

// ✅ Attach socket instance globally (if needed by routes)
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);
  socket.on("disconnect", () => console.log("🔴 Client disconnected"));
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

