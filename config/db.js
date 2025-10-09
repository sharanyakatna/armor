const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI environment variable is not defined.");
    return; // don't try to connect; let the app start for health checks
  }

  try {
    // No deprecated options — Mongoose handles parser & topology internally now
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    // don't call process.exit(1) in AWS; it kills the health check loop
  }
};

module.exports = connectDB;

