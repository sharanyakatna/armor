const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  upiId: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  behaviors: {
    type: [String],
    default: [],
  },
  reporterUpi: {
    type: String, // ✅ Optional field for who reported
    default: null,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  // 🟡 Moderation fields added below
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // all new reports start as pending
  },
  reviewedBy: {
    type: String, // admin username or email
    default: null,
  },
  reviewedAt: {
    type: Date, // timestamp of when admin reviewed
    default: null,
  },
});

module.exports = mongoose.model("Report", reportSchema);
