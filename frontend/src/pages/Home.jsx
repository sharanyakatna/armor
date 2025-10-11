import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50 text-gray-800"
    >
      {/* Hero Section */}
      <section className="text-center py-16 px-6 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-2">Welcome to ARMOR</h1>
        <p className="text-gray-600 mb-10">
          Your trusted partner in fraud prevention and secure transactions.
        </p>

        <div className="max-w-4xl mx-auto bg-gray-200 rounded-xl h-64 flex items-center justify-center">
          <span className="text-gray-500">[ Banner Image Placeholder ]</span>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Verify UPI Card */}
          <div className="border border-gray-200 rounded-lg shadow-sm p-8 text-center bg-white hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Verify UPI</h3>
            <p className="text-gray-600 mb-4">
              Quickly verify UPI IDs to ensure safe and secure transactions.
            </p>
            <Link
              to="/verify"
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Learn More
            </Link>
          </div>

          {/* Report Fraud Card */}
          <div className="border border-gray-200 rounded-lg shadow-sm p-8 text-center bg-white hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">Report Fraud</h3>
            <p className="text-gray-600 mb-4">
              Report suspicious activities and help us combat fraud effectively.
            </p>
            <Link
              to="/report"
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-gray-100">
        <h2 className="text-2xl font-semibold mb-8 text-center">User Testimonials</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <p className="italic text-gray-700 mb-3">
              “ARMOR has revolutionized how I handle online transactions. Highly recommend!”
            </p>
            <p className="text-gray-500 text-sm">– Alex Johnson</p>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <p className="italic text-gray-700 mb-3">
              “A must-have tool for anyone concerned about online security.”
            </p>
            <p className="text-gray-500 text-sm">– Sneha Lin</p>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <p className="italic text-gray-700 mb-3">
              “Efficient and reliable service. ARMOR gives me peace of mind.”
            </p>
            <p className="text-gray-500 text-sm">– Michael Smith</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-gray-100">
        <h2 className="text-2xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <h4 className="font-semibold mb-2">How does UPI verification work?</h4>
            <p className="text-gray-600 text-sm">
              UPI verification checks the validity of a UPI ID by cross-referencing it with
              secure databases to ensure that the ID is genuine and not reported for fraud.
            </p>
          </div>

          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <h4 className="font-semibold mb-2">What should I do if I suspect fraud?</h4>
            <p className="text-gray-600 text-sm">
              Immediately report any suspicious activity on our Report Fraud page and follow
              the security steps provided to protect your account.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-2">Contact Us</h4>
            <p className="text-sm text-gray-600">Email: support@armorsecure.com</p>
            <p className="text-sm text-gray-600">Phone: +91 98765 43210</p>
          </div>

          {/* Quick Links */}
          <div className="md:text-right">
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link to="/verify" className="hover:text-blue-600">Verify UPI</Link></li>
              <li><Link to="/report" className="hover:text-blue-600">Report Fraud</Link></li>
              <li><Link to="#" className="hover:text-blue-600">FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          © {new Date().getFullYear()} ARMOR. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
}
