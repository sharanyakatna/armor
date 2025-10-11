import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Use environment variable later for real security
    if (password === "ArmorSecure@2025") {
      localStorage.setItem("armorAdmin", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-6">Authorized personnel only</p>

        <input
          type="password"
          placeholder="Enter admin password"
          className="border w-full p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
