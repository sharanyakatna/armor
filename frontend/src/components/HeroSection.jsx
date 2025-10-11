import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500 text-white py-24">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Secure UPI Payments with <span className="text-emerald-200">ARMOR</span>
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Verify UPI IDs, report frauds, and protect yourself from scams — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/verify"
            className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            🔍 Verify UPI
          </Link>
          <Link
            to="/report"
            className="bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            🚨 Report Fraud
          </Link>
        </div>
      </div>
    </section>
  );
}
