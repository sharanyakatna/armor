import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import socket from "../lib/socket";
import { getLiveReports } from "../lib/liveReportsStore"; // 🧠 persistent live feed

export default function VerifyUPI() {
  const [upiId, setUpiId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [liveReports, setLiveReports] = useState(getLiveReports()); // ✅ initialize from store

  const fraudFacts = [
    "💬 1 in 5 scam reports involve fake e-commerce stores.",
    "🏦 Never share your UPI PIN — not even with verified contacts.",
    "⚠️ Always double-check the merchant UPI ID before paying.",
    "🔍 Verification takes 2 seconds — save yourself from scams!",
  ];

  // 🔁 Rotate awareness facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % fraudFacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Real-time updates using persistent socket
  useEffect(() => {
    // start with global reports
    setLiveReports(getLiveReports());

    const handleUpdate = () => {
      setLiveReports(getLiveReports());
    };

    socket.on("approvedReport", handleUpdate);

    return () => {
      socket.off("approvedReport", handleUpdate);
    };
  }, []);

  const handleVerify = async () => {
    if (!upiId) return setError("Please enter a UPI ID.");
    setError("");
    setResult(null);
    setShowHistory(false);

    try {
      const res = await api.get(`/verifyUPI/${upiId}`);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Server error while verifying UPI.");
    }
  };

  return (
    <div className="flex flex-col items-center py-16 text-gray-800 px-4">
      {/* ⚠️ Awareness Banner */}
      <motion.div
        className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 w-full md:w-2/3 shadow-sm text-center mb-10"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-lg md:text-xl font-semibold text-yellow-800 mb-2 flex items-center justify-center gap-2">
          ⚠️ Why Verify a UPI?
        </h2>
        <p className="text-gray-700 text-sm md:text-base mb-3">
          Over ₹1,200 crore lost to UPI scams in 2025. Always verify before sending money!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm text-gray-600">
          <p>🛡️ Protect yourself from fake merchants</p>
          <p>📲 Spot phishing and impersonation scams</p>
          <p>👥 See if others have reported this ID</p>
        </div>
      </motion.div>

      {/* 🔍 Verify Input */}
      <h2 className="text-3xl font-semibold text-blue-600 mb-6">
        Verify UPI for Potential Fraud
      </h2>

      <input
        type="text"
        placeholder="Enter UPI ID"
        className="border p-2 rounded w-80 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
      />

      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Verify
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}

      {/* 🧾 Verification Result */}
      {result && (
        <div className="mt-10 w-96 bg-white border border-gray-200 shadow rounded-lg p-6 text-center">
          {result.status?.includes("Fraudulent") ? (
            <>
              <p className="text-red-600 font-semibold text-lg mb-3">
                ⚠️ Reported as Fraudulent
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Reported:</strong> {result.reportCount}{" "}
                {result.reportCount === 1 ? "time" : "times"}
              </p>

              {/* Latest Report */}
              {result.latest && (
                <div className="bg-gray-50 p-3 rounded text-sm mb-3 text-left">
                  <p className="font-medium text-gray-700 mb-1">Latest Report:</p>
                  <p className="text-gray-600 mb-1">
                    {result.latest.description || "No details provided."}
                  </p>

                  {Array.isArray(result.latest.behaviors) &&
                    result.latest.behaviors.length > 0 && (
                      <div className="text-xs text-gray-700 mb-2">
                        <p className="font-semibold">Behaviors:</p>
                        <ul className="list-disc list-inside">
                          {result.latest.behaviors.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <p className="text-gray-400 text-xs">
                    {new Date(result.latest.reportedAt).toLocaleString()}
                    {result.latest.reporterUpi && (
                      <>
                        {" "}
                        • Reported by{" "}
                        <span className="text-gray-600">
                          {result.latest.reporterUpi}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Previous Reports (max 5) with behaviors + reporter info */}
              {result.allReports?.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-blue-600 text-sm underline mt-2"
                  >
                    {showHistory
                      ? "Hide Previous Reports"
                      : `Show Last ${Math.min(5, result.allReports.length)} Reports`}
                  </button>

                  {showHistory && (
                    <ul className="mt-3 text-left text-sm text-gray-700 space-y-3">
                      {result.allReports.slice(0, 5).map((r, i) => (
                        <li key={i} className="border-b pb-2">
                          <p className="mb-1">{r.description || "No details provided."}</p>

                          {Array.isArray(r.behaviors) &&
                            r.behaviors.length > 0 && (
                              <div className="text-xs text-gray-600 mb-1">
                                <p className="font-semibold">Behaviors:</p>
                                <ul className="list-disc list-inside">
                                  {r.behaviors.map((b, j) => (
                                    <li key={j}>{b}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          <p className="text-gray-400 text-xs">
                            {new Date(r.reportedAt).toLocaleString()}
                            {r.reporterUpi && (
                              <>
                                {" "}
                                • Reported by{" "}
                                <span className="text-gray-600">{r.reporterUpi}</span>
                              </>
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-green-600 font-medium text-lg">{result.status}</p>
          )}
        </div>
      )}

      {/* 💡 Facts Carousel */}
      <div className="relative h-28 mt-14 w-11/12 md:w-2/3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFact}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-md rounded-xl p-5 flex items-center justify-center text-center"
          >
            <motion.p
              className="text-gray-700 text-sm md:text-base font-medium"
              whileHover={{
                scale: 1.05,
                color: "#1e40af",
                textShadow: "0px 0px 8px rgba(59,130,246,0.4)",
              }}
            >
              {fraudFacts[currentFact]}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 🟢 Live Fraud Reports Feed */}
      <div className="mt-16 w-full md:w-2/3">
        <h3 className="text-xl font-semibold text-red-600 mb-3 text-center">
          ⚡ Live Fraud Reports Feed
        </h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto shadow-inner space-y-3">
          {liveReports.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No recent fraud reports yet. Stay alert 🔍
            </p>
          ) : (
            <AnimatePresence>
              {liveReports.map((r) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 text-sm"
                >
                  <p className="font-semibold text-gray-800">⚠️ {r.upiId}</p>
                  <p className="text-gray-600 mt-1">
                    {r.description || "No details provided."}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.reportedAt).toLocaleString()}
                    {r.reporterUpi && (
                      <>
                        {" "}
                        • Reported by{" "}
                        <span className="text-gray-600">{r.reporterUpi}</span>
                      </>
                    )}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
