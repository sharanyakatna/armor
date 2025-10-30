import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("armorAdmin");
    if (!isAdmin) {
      navigate("/admin");
    }

    // Fetch all reports from backend
    axios.get("http://localhost:5000/api/admin/reports")
      .then(res => setReports(res.data))
      .catch(() => setReports([]));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("armorAdmin");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {reports.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">No reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-5 border">
              <h3 className="font-semibold text-blue-700 mb-2">{report.upiId}</h3>
              <p className="text-gray-700 mb-2">{report.description}</p>
              <p className="text-sm text-gray-500">Date: {new Date(report.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
