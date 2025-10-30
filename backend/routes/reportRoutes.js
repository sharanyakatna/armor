const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

/* 🟢 POST: Report a fraudulent UPI (saved as pending by default) */
router.post("/reportFraud", async (req, res) => {
  try {
    const { upiId, description, behaviors, yourUpiId } = req.body;
    const io = req.app.get("io");

    if (!upiId || !description) {
      return res.status(400).json({ error: "UPI ID and description are required." });
    }

    const report = new Report({
      upiId,
      description,
      behaviors: Array.isArray(behaviors) ? behaviors : [],
      reporterUpi: yourUpiId || null,
      status: "pending",
    });

    await report.save();

    // ✅ Emit real-time event with proper MongoDB _id string
    io.emit("newReport", {
      _id: report._id.toString(),
      upiId: report.upiId,
      description: report.description,
      behaviors: report.behaviors,
      reportedAt: report.reportedAt,
      reporterUpi: report.reporterUpi,
      status: report.status,
    });

    res.status(201).json({ message: "Fraud report submitted for admin review!" });
  } catch (error) {
    console.error("❌ Error saving fraud report:", error);
    res.status(500).json({ error: "Server error while reporting fraud" });
  }
});

/* 🔵 GET: Verify only APPROVED reports */
router.get("/verifyUPI/:upiId", async (req, res) => {
  try {
    const { upiId } = req.params;
    const reports = await Report.find({ upiId, status: "approved" }).sort({ reportedAt: -1 });

    if (reports.length === 0) {
      return res.json({ status: "✅ Safe / Not Reported" });
    }

    const reportCount = reports.length;
    const latest = reports[0];
    const allReports = reports.slice(1);

    res.json({
      status: "⚠️ Reported as Fraudulent",
      reportCount,
      latest: {
        description: latest.description,
        reportedAt: latest.reportedAt,
        behaviors: latest.behaviors || [],
        reporterUpi: latest.reporterUpi || null,
      },
      allReports: allReports.map((r) => ({
        description: r.description,
        reportedAt: r.reportedAt,
        behaviors: r.behaviors || [],
        reporterUpi: r.reporterUpi || null,
      })),
    });
  } catch (error) {
    console.error("Error verifying UPI:", error);
    res.status(500).json({ error: "Server error while verifying UPI" });
  }
});

/* 🟠 ADMIN: Get all pending reports */
router.get("/admin/reports/pending", async (req, res) => {
  try {
    const pendingReports = await Report.find({ status: "pending" }).sort({ reportedAt: -1 });
    res.json(pendingReports);
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    res.status(500).json({ error: "Server error while fetching pending reports" });
  }
});

/* 🟢 ADMIN: Approve a report */
router.patch("/admin/reports/:id/approve", async (req, res) => {
  try {
    const io = req.app.get("io");
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid report ID" });
    }

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "approved";
    report.reviewedBy = "admin";
    report.reviewedAt = new Date();
    await report.save();

    // ✅ Emit real-time event for approved reports
    io.emit("approvedReport", {
      _id: report._id.toString(),
      upiId: report.upiId,
      description: report.description,
      behaviors: report.behaviors,
      reporterUpi: report.reporterUpi,
      reportedAt: report.reportedAt,
    });

    res.json({ message: "✅ Report approved successfully." });
  } catch (error) {
    console.error("Error approving report:", error);
    res.status(500).json({ error: "Server error while approving report" });
  }
});

/* 🔴 ADMIN: Reject a report */
router.patch("/admin/reports/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid report ID" });
    }

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "rejected";
    report.reviewedBy = "admin";
    report.reviewedAt = new Date();
    await report.save();

    res.json({ message: "🚫 Report rejected successfully." });
  } catch (error) {
    console.error("Error rejecting report:", error);
    res.status(500).json({ error: "Server error while rejecting report" });
  }
});

/* 🔄 ADMIN: Undo approval or rejection */
router.patch("/admin/reports/:id/undo", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid report ID" });
    }

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = "pending";
    report.reviewedBy = null;
    report.reviewedAt = null;
    await report.save();

    res.json({ message: "↩️ Report restored to pending.", report });
  } catch (error) {
    console.error("Error undoing moderation:", error);
    res.status(500).json({ error: "Server error while undoing report" });
  }
});

module.exports = router;
