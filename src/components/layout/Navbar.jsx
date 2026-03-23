import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  X,
  ChevronDown,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import SignIn from "../shared/Signin";
import SignUp from "../shared/SignUp";
import logo from "../../assets/images/Logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [authStep, setAuthStep] = useState("role");
  const [selectedRole, setSelectedRole] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const communityRef = useRef(null);
  const userMenuRef = useRef(null);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (communityRef.current && !communityRef.current.contains(e.target))
        setCommunityOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      loginModalOpen || mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loginModalOpen, mobileMenuOpen]);

  const communityOptions = [
    { label: "Family", href: "/community/family" },
    { label: "Male", href: "/community/male" },
    { label: "Female", href: "/community/female" },
    { label: "Combined", href: "/community/combined" },
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Explore", href: "/explore" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isActive = (href) => location.pathname === href;

  // ── Auth modal helpers ──
  const openLoginFlow = () => {
    setLoginModalOpen(true);
    setAuthStep("role");
    setActiveTab("signin");
    setSelectedRole("");
  };

  const closeLoginFlow = () => {
    setLoginModalOpen(false);
    setAuthStep("role");
    setActiveTab("signin");
    setSelectedRole("");
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setAuthStep("auth");
    setActiveTab("signin");
  };

  // Called after successful sign-in / sign-up
  const handleAuthSuccess = () => {
    closeLoginFlow();
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const roleTitle = selectedRole ? `${selectedRole} Account` : "Account";

  // ── Avatar initials ──
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <>
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0F393E]/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-[#0F393E]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* ── LOGO ── */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src={logo}
                alt="Jatra"
                className="h-13 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Link>

            {/* ── DESKTOP NAV ── */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "text-green-400 bg-green-400/10"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                Home
              </Link>

              {/* Community dropdown */}
              <div className="relative" ref={communityRef}>
                <button
                  onClick={() => setCommunityOpen(!communityOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    communityOpen
                      ? "text-green-400 bg-green-400/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>Choose Community</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${communityOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {communityOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-gray-800 rounded-xl shadow-xl shadow-black/30 border border-white/10 overflow-hidden z-50">
                    {communityOptions.map((opt) => (
                      <Link
                        key={opt.label}
                        to={opt.href}
                        onClick={() => setCommunityOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-green-500/20 transition-all duration-150"
                      >
                        <span className="font-medium">{opt.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-green-400 bg-green-400/10"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── RIGHT: Login button OR User avatar ── */}
            <div className="hidden lg:flex items-center">
              {user ? (
                // ── Logged in: show avatar + dropdown ──
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                  >
                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {initials || <UserIcon size={14} />}
                    </div>
                    <div className="text-left">
                      <p className="text-white text-xs font-semibold leading-tight">
                        {user.fullName}
                      </p>
                      <p className="text-gray-400 text-[10px] capitalize leading-tight">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* User dropdown */}
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <UserIcon size={15} />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/dashboard/bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-t border-white/5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="1" />
                        </svg>
                        <span>My Bookings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/10 cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // ── Not logged in: show login button ──
                <button
                  onClick={openLoginFlow}
                  className="px-6 py-2.5 bg-green-500 hover:bg-green-400 cursor-pointer text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
                >
                  Login
                </button>
              )}
            </div>

            {/* ── MOBILE HAMBURGER ── */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          className={`lg:hidden bg-[#0F393E] border-t border-white/10 overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-1">
            {/* Mobile user info if logged in */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/5 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {user.fullName}
                  </p>
                  <p className="text-gray-400 text-xs capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
            >
              Home
            </Link>

            <div>
              <button
                onClick={() => setCommunityOpen(!communityOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              >
                <span>Choose Community</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${communityOpen ? "rotate-180" : ""}`}
                />
              </button>
              {communityOpen && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-green-500/30 pl-4">
                  {communityOptions.map((opt) => (
                    <Link
                      key={opt.label}
                      to={opt.href}
                      onClick={() => {
                        setCommunityOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  to="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── AUTH MODAL ── */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLoginFlow();
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" />

          <div className="relative bg-[#0F393E] rounded-2xl shadow-2xl w-full max-w-md border border-white/10 overflow-hidden">
            <button
              onClick={closeLoginFlow}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={16} />
            </button>

            {/* ── Step 1: Role selection ── */}
            {authStep === "role" && (
              <div className="p-8 pt-14 text-center">
                <h2 className="text-4xl font-semibold text-white">
                  SELECT YOUR ROLE
                </h2>
                <p className="mt-3 text-xl text-gray-300">
                  Please select how you want to continue
                </p>
                <div className="mt-8 space-y-5">
                  <button
                    onClick={() => handleRoleSelect("User")}
                    className="w-full rounded-xl bg-white/95 py-2 text-3xl text-emerald-700 hover:bg-white cursor-pointer transition-colors"
                  >
                    USER
                  </button>
                  <p className="text-2xl text-white">OR</p>
                  <button
                    onClick={() => handleRoleSelect("Agent")}
                    className="w-full rounded-xl bg-white/95 py-2 text-3xl text-emerald-700 hover:bg-white cursor-pointer transition-colors"
                  >
                    AGENT
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 2: Sign In / Sign Up ── */}
            {authStep === "auth" && (
              <>
                <div className="px-6 pt-6 pb-2 border-b border-white/10">
                  <button
                    onClick={() => setAuthStep("role")}
                    className="text-xs flex gap-2 font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                  >
                    <ArrowLeftIcon size={16} />
                    Back to role selection
                  </button>
                  <p className="mt-2 text-sm text-green-400 font-medium">
                    {roleTitle}
                  </p>
                </div>

                <div className="flex border-b border-white/10">
                  {["signin", "signup"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-sm font-semibold hover:cursor-pointer transition-all duration-200 ${
                        activeTab === tab
                          ? "text-green-400 border-b-2 border-green-400 bg-green-400/5"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab === "signin" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  {activeTab === "signin" && (
                    <SignIn
                      role={selectedRole}
                      onSwitchToSignup={() => setActiveTab("signup")}
                      onSuccess={handleAuthSuccess}
                    />
                  )}
                  {activeTab === "signup" && (
                    <SignUp
                      role={selectedRole}
                      onSwitchToSignin={() => setActiveTab("signin")}
                      onSuccess={handleAuthSuccess}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
