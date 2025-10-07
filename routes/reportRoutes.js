const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// 🟢 POST: report a fraudulent UPI
router.post("/reportFraud", async (req, res) => {
  try {
    const { upiId, description } = req.body;
    const report = new Report({ upiId, description });
    await report.save();
    res.status(201).json({ message: "Fraud report submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error while reporting fraud" });
  }
});

// 🔵 GET: verify if a UPI has been reported
router.get("/verifyUPI/:upiId", async (req, res) => {
  try {
    const { upiId } = req.params;
    const report = await Report.findOne({ upiId });

    if (report) {
      res.json({
        status: "⚠️ Reported as Fraudulent",
        description: report.description,
        reportedAt: report.reportedAt,
      });
    } else {
      res.json({ status: "✅ Safe / Not Reported" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error while verifying UPI" });
  }
});

module.exports = router;
