import React, { useState } from "react";
import contactHero from "../assets/images/ContactHeader.png";

// TODO: POST /api/contact
// Body:     { name, email, phone, subject, message }
// Response: { success: true }

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      // TODO: uncomment when backend ready
      // const res  = await fetch("/api/contact", {
      //   method:  "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body:    JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error();
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors";

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: "64px" }}>

      {/* ══════════════════════════════════════
          HERO — full width, no container
      ══════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ height: "420px" }} >
        <img
          src={contactHero}
          alt="Contact us"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentNode.style.background =
              "linear-gradient(135deg,#0f393e 0%,#0d7377 60%,#14a085 100%)";
          }}
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Section 1 badge */}
        {/* <div className="absolute bottom-4 left-4 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded border border-white/25">
          Section 1
        </div> */}
      </div>

      {/* ══════════════════════════════════════
          CARD — overlaps hero bottom edge
      ══════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto px-4 container sm:px-6 -mt-6 relative z-10 pb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          <div className="text-center pt-8 pb-4 px-6">
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
          </div>

          <div className="flex flex-col md:flex-row px-6 sm:px-8 pb-8 gap-8">

            {/* ── LEFT — Contact Info ── */}
            <div className="w-full md:w-[44%]">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Info</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-justify mb-6">
                Ready to explore new destinations or looking for the perfect travel plan? Connect
                with us and let our team help you turn your travel ideas into an amazing and
                memorable journey.
              </p>

              {/* Reach us on */}
              <p className="text-gray-800 text-sm font-semibold mb-2">Reach us on:</p>
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span className="text-gray-700 text-xs">Mohammadpur, Dhaka -1207</span>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <span className="text-gray-700 text-xs">jatra@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span className="text-gray-700 text-xs">017xxxxxxxxx</span>
                </div>
              </div>

              {/* Follow us on */}
              <p className="text-gray-800 text-sm font-semibold mb-2">Follow us on:</p>
              <div className="space-y-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 hover:border-teal-400 hover:bg-teal-100 transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#1877F2" className="flex-shrink-0">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-gray-700 text-xs group-hover:text-teal-700 transition-colors">Facebook</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 hover:border-teal-400 hover:bg-teal-100 transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="flex-shrink-0">
                    <defs>
                      <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f09433"/><stop offset="25%" stopColor="#e6683c"/>
                        <stop offset="50%" stopColor="#dc2743"/><stop offset="75%" stopColor="#cc2366"/>
                        <stop offset="100%" stopColor="#bc1888"/>
                      </linearGradient>
                    </defs>
                    <path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                  <span className="text-gray-700 text-xs group-hover:text-teal-700 transition-colors">Instagram</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2 hover:border-teal-400 hover:bg-teal-100 transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2" className="flex-shrink-0">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span className="text-gray-700 text-xs group-hover:text-teal-700 transition-colors">Linkedin</span>
                </a>
              </div>
            </div>

            {/* ── RIGHT — Form ── */}
            <div className="w-full md:w-[56%]">
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text"  name="name"    value={form.name}    onChange={handleChange} placeholder="Name"    required className={inputCls} />
                <input type="email" name="email"   value={form.email}   onChange={handleChange} placeholder="Email"   required className={inputCls} />
                <input type="tel"   name="phone"   value={form.phone}   onChange={handleChange} placeholder="Phone"            className={inputCls} />
                <input type="text"  name="subject" value={form.subject} onChange={handleChange} placeholder="Subject"          className={inputCls} />
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Message" required rows={5}
                  className={`${inputCls} resize-none`}
                />
                {status === "success" && <p className="text-teal-600 text-xs font-medium">✓ Message sent successfully!</p>}
                {status === "error"   && <p className="text-red-500  text-xs font-medium">✗ Something went wrong. Please try again.</p>}
                <button type="submit" disabled={status === "loading"}
                  className="w-full py-3 bg-[#0F393E] hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending...
                    </>
                  ) : "Send Message"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactUs;
