import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { updateMyProfile } from "../../services/authService";

// TODO: GET /api/auth/me  — prefill existing values
// TODO: PUT /api/auth/profile — update profile
// Body: { firstName, lastName, email, phone, address, newPassword, confirmPassword }

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    newPassword: "",
    confirmPassword: "",
  }));
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setErrMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      const updatedUser = await updateMyProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        newPassword: form.newPassword || undefined,
      });
      login(updatedUser);
      setStatus("success");
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    } catch (err) {
      setErrMsg(err.message || "Update failed. Please try again.");
      setStatus("error");
    }
  };

  const inputCls =
    "w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";
  const labelCls = "block text-white text-xs font-semibold mb-1.5";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-3xl">Update Profile</h1>

      <form onSubmit={handleSubmit}>
        {/* 3-column grid — matches design exactly */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {/* First Name */}
          <div>
            <label className={labelCls}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className={inputCls}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className={inputCls}
            />
          </div>

          {/* New Password */}
          <div>
            <label className={labelCls}>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New password"
              className={inputCls}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              className={inputCls}
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={inputCls}
            />
          </div>

          {/* Phone Number — BD flag + code prefix */}
          <div className="sm:col-start-1 lg:col-span-1">
            <label className={labelCls}>Phone Number</label>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-colors">
              {/* BD flag + code */}
              <div className="flex items-center gap-1.5 px-3 border-r border-gray-200 bg-gray-50 h-full py-2.5 flex-shrink-0">
                {/* 🇧🇩 flag emoji */}
                <span className="text-base leading-none">🇧🇩</span>
                <span className="text-gray-600 text-xs font-semibold">BD</span>
                {/* Lucide ChevronDown */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="17xxxxxxxx"
                className="flex-1 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelCls}>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Your address"
              className={inputCls}
            />
          </div>
        </div>

        {/* Error / success messages */}
        {errMsg && (
          <p className="text-red-400 text-sm mb-4 font-medium">✗ {errMsg}</p>
        )}
        {status === "success" && (
          <p className="text-green-400 text-sm mb-4 font-medium">
            ✓ Profile updated! Redirecting...
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-8 py-3 font-bold text-white transition-all duration-200 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:justify-start"
        >
          {status === "loading" ? (
            <>
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
