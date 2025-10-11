import { useState, useEffect } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../lib/socket"; // ✅ use global socket

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [undoData, setUndoData] = useState(null);
  const [showPending, setShowPending] = useState(false);

  const SECRET_PASSWORD = "armoradmin";

  // 🧠 Real-time new reports listener
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Admin connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Admin disconnected");
    });

    socket.on("newReport", (newReport) => {
      setReports((prev) => {
        const exists = prev.some((r) => r._id === newReport._id);
        return exists ? prev : [newReport, ...prev];
      });
      setStatusMessage("🆕 New report received in real time!");
    });

    // only remove listeners, don’t disconnect socket
    return () => {
      socket.off("newReport");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const fetchPendingReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reports/pending");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      if (!id) return alert("Invalid report ID.");
      await api.patch(`/admin/reports/${id}/approve`);
      const removed = reports.find((r) => r._id === id);
      setUndoData({ ...removed, action: "approve" });
      setReports((prev) => prev.filter((r) => r._id !== id));
      setStatusMessage("✅ Report approved successfully!");
    } catch (err) {
      console.error("Error approving report:", err);
      setStatusMessage("❌ Failed to approve report.");
    }
  };

  const handleReject = async (id) => {
    try {
      if (!id) return alert("Invalid report ID.");
      await api.patch(`/admin/reports/${id}/reject`);
      const removed = reports.find((r) => r._id === id);
      setUndoData({ ...removed, action: "reject" });
      setReports((prev) => prev.filter((r) => r._id !== id));
      setStatusMessage("🚫 Report rejected successfully!");
    } catch (err) {
      console.error("Error rejecting report:", err);
      setStatusMessage("❌ Failed to reject report.");
    }
  };

  const handleUndo = async () => {
    if (!undoData) return;
    try {
      await api.patch(`/admin/reports/${undoData._id}/undo`);
      setReports((prev) => [undoData, ...prev]);
      setUndoData(null);
      setStatusMessage("↩️ Action undone. Report restored to pending.");
    } catch (err) {
      console.error("Error undoing action:", err);
      setStatusMessage("❌ Failed to undo action.");
    }
  };

  const handleLogin = () => {
    if (adminPassword === SECRET_PASSWORD) {
      setAuthenticated(true);
      fetchPendingReports();
    } else {
      alert("Incorrect password. Access denied!");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Admin Access Only 🔒</h2>
        <input
          type="password"
          placeholder="Enter Admin Password"
          className="border p-2 rounded mb-4 w-72 text-center focus:ring-2 focus:ring-blue-500 outline-none"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        🛡️ ARMOR Admin Dashboard
      </h1>

      {statusMessage && (
        <p className="text-center mb-4 text-green-600 font-medium">
          {statusMessage}
          {undoData && (
            <button
              onClick={handleUndo}
              className="ml-3 text-blue-600 underline hover:text-blue-800"
            >
              Undo
            </button>
          )}
        </p>
      )}

      <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl shadow p-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowPending(!showPending)}
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            🕒 Pending Requests
          </h2>
          <span className="text-gray-500">
            {showPending ? "▲ Hide" : "▼ Show"}
          </span>
        </div>

        {showPending && (
          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">
                Loading pending reports...
              </p>
            ) : reports.length === 0 ? (
              <p className="text-center text-gray-500">
                🎉 No pending reports at the moment.
              </p>
            ) : (
              <AnimatePresence>
                {reports.map((report) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-700 text-lg">
                        {report.upiId}
                      </h3>
                      <p className="text-gray-700 mt-1">
                        {report.description}
                      </p>
                      {report.reporterUpi && (
                        <p className="text-gray-500 text-xs mt-1">
                          Reported by: {report.reporterUpi}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4 justify-end md:w-auto">
                      <button
                        onClick={() => handleReject(report._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
                      >
                        Reject ❌
                      </button>
                      <button
                        onClick={() => handleApprove(report._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
                      >
                        Approve ✅
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
