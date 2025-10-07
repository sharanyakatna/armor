const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  upiId: { type: String, required: true },
  description: { type: String },
  reportedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
