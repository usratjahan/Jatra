import React, { useState } from "react";
import { signUp } from "../../services/authService";
import { useAuth } from "../../context/useAuth";

const SignUp = ({ onSwitchToSignin, role, onSuccess }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const roleLabel = role || "User";

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { firstName, lastName, email, phone, password } = form;
    if (!firstName || !lastName || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!accepted) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    setLoading(true);
    try {
      const user = await signUp({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });
      login(user);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">
            Join the Jatra community as {roleLabel}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              First Name
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Usrat"
              className="w-full px-4 py-3 bg-white border border-white/10 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Last Name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Jahan"
              className="w-full px-4 py-3 bg-white border border-white/10 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-white border border-white/10 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+880 1xxx-xxxxxx"
            className="w-full px-4 py-3 bg-white border border-white/10 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-3 bg-white border border-white/10 rounded-lg text-black text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 mt-2">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mt-1 w-4 h-4 accent-green-500 cursor-pointer"
          />
          <p className="text-gray-400 text-sm leading-6">
            I have read and accept the{" "}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              Terms and Conditions
            </button>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !accepted}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2 ${
            accepted && !loading
              ? "bg-green-500 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
              : "bg-gray-600 cursor-not-allowed opacity-70"
          }`}
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
          {loading ? "Creating account…" : `Create ${roleLabel} Account`}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignin}
            className="text-green-400 hover:text-green-300 font-medium transition-colors"
          >
            Sign In
          </button>
        </p>
      </form>

      {/* ── Terms Modal ── */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-gray-900 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-xl font-bold">Terms and Conditions</h2>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5 text-sm text-gray-300 space-y-4 leading-7">
              <p>
                Welcome to Jatra. By accessing or using this website, you agree
                to follow the terms and conditions described below.
              </p>
              {[
                [
                  "1. User Registration",
                  "To use certain features, users may be required to create an account. Users must provide accurate and complete information. The user is responsible for maintaining confidentiality of their account and password.",
                ],
                [
                  "2. Tour Booking",
                  "Users can explore and book available tour packages through the platform. All bookings are subject to availability.",
                ],
                [
                  "3. Payments",
                  "Payments must be completed through the approved payment methods provided on the platform. The platform reserves the right to cancel bookings if payment is not completed within the required time.",
                ],
                [
                  "4. Minimum Participant Requirement",
                  "Each event or tour requires a minimum number of participants. If not reached, the event may be postponed or cancelled. Users will be notified and may choose to join another event or receive a refund.",
                ],
                [
                  "5. Cancellation and Refund Policy",
                  "Users may cancel bookings according to the cancellation policy mentioned in each tour package. Refunds will be processed based on the rules defined by the platform or tour agent.",
                ],
                [
                  "6. User Responsibilities",
                  "Users must behave respectfully towards local communities, guides, and other travelers. Any illegal or harmful behavior may lead to account suspension or cancellation.",
                ],
                [
                  "7. Agent Responsibilities",
                  "Agents who provide tour packages must ensure the information they provide is accurate and reliable. Agents are responsible for the quality and safety of the tours they organize.",
                ],
                [
                  "8. Limitation of Liability",
                  "The platform acts as a facilitator connecting users and agents. We are not responsible for any personal injury, loss, or damage occurring during tours.",
                ],
                [
                  "9. Changes to Terms",
                  "The platform reserves the right to update or modify these terms at any time. Continued use indicates acceptance of the updated terms.",
                ],
                [
                  "10. Contact Information",
                  "If you have questions regarding these Terms and Conditions, please contact us through the contact page of the website.",
                ],
              ].map(([title, body]) => (
                <div key={title}>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccepted(true);
                  setShowTerms(false);
                }}
                className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-400 text-white font-medium"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
