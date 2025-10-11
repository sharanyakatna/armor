import { useState } from "react";
import api from "../lib/api";
import { motion } from "framer-motion";

export default function ReportFraud() {
  const [formData, setFormData] = useState({
    suspiciousUpiId: "",
    yourUpiId: "",
    description: "",
    behaviors: [],
    evidence: "",
  });
  const [status, setStatus] = useState("");

  const fraudBehaviors = [
    "Fake Merchant/Business",
    "Phishing/Scam Messages",
    "Non-delivery of Goods",
    "Identity Theft",
    "Money Laundering",
    "Unauthorized Transactions",
    "Fake Documents",
    "Multiple Fake Accounts",
    "Investment/Ponzi Scheme",
    "Romance/Dating Scam",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBehaviorToggle = (behavior) => {
    const updated = formData.behaviors.includes(behavior)
      ? formData.behaviors.filter((b) => b !== behavior)
      : [...formData.behaviors, behavior];
    setFormData({ ...formData, behaviors: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.suspiciousUpiId || !formData.description)
      return setStatus("❌ Please fill required fields.");

    try {
      await api.post("/reportFraud", {
        upiId: formData.suspiciousUpiId,
        description: formData.description,
        behaviors: formData.behaviors,
        yourUpiId: formData.yourUpiId,
      });

      setStatus("✅ Fraud report submitted successfully!");
      setFormData({
        suspiciousUpiId: "",
        yourUpiId: "",
        description: "",
        behaviors: [],
        evidence: "",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      setStatus("❌ Error submitting fraud report. Try again.");
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto py-16 px-6 text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Report Fraudulent UPI ID</h1>
        <p className="text-gray-600">
          Help protect the community by reporting suspicious accounts.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg border border-gray-200 rounded-xl p-8 space-y-6"
      >
        <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
          🚩 Fraud Report Form
        </h2>

        {/* UPI IDs */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Suspicious UPI ID *</label>
            <input
              type="text"
              name="suspiciousUpiId"
              value={formData.suspiciousUpiId}
              onChange={handleChange}
              placeholder="e.g., suspicious@paytm"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Your UPI ID (Optional)</label>
            <input
              type="text"
              name="yourUpiId"
              value={formData.yourUpiId}
              onChange={handleChange}
              placeholder="e.g., yourname@phonepe"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Detailed Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe what happened..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* FRAUD BEHAVIORS */}
        <div>
          <h3 className="font-medium mb-2">
            Fraud Behaviors (Select all that apply)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fraudBehaviors.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2 border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.behaviors.includes(b)}
                  onChange={() => handleBehaviorToggle(b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>

        {/* EVIDENCE */}
        <div>
          <label className="block font-medium mb-1">Evidence (Optional)</label>
          <input
            type="text"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            placeholder="Link to screenshots or chat logs"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit Fraud Report
        </button>

        {status && (
          <p
            className={`text-center font-medium ${
              status.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>

      {/* ⚖️ Legal Disclaimer */}
      <div className="mt-10 bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          ⚠️ Important Notice
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong>False reporting is a serious offense</strong> and may result in legal
          action. Only report accounts that you genuinely believe are involved in
          fraudulent activities. All reports are thoroughly investigated before any
          action is taken.
        </p>
      </div>
    </motion.div>
  );
}
