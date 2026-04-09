// FILE: src/pages/AdminLogin.jsx
// Route: /admin  (no Navbar/Footer)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";

const AdminLogin = () => {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await adminLogin({ email, password });
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm p-8">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
          Administration panel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              E-mail:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              {loading && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              Sign in
            </button>
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
