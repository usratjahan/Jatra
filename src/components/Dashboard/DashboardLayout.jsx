import {
  LucideClock,
  LucideLogOut,
  LucideUserCircle,
  UserCircle,
} from "lucide-react";
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userDisplayName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "User";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navCls = ({ isActive }) =>
    `flex items-center gap-2 sm:gap-3 text-sm font-medium px-2 py-2 rounded-lg transition-colors ${
      isActive ? "text-green-400" : "text-white/80 hover:text-white"
    }`;

  return (
    <div
      className="min-h-screen overflow-x-hidden pt-16"
      //   style={{
      //     background:
      //       "linear-gradient(160deg,#0a2a2e 0%,#0d3d42 40%,#0f4a50 100%)",
      //   }}
    >
      <div className="flex min-h-[calc(100vh-64px)] flex-col xl:flex-row">
        {/* ══════════════════════════
            LEFT SIDEBAR
        ══════════════════════════ */}
        <aside
          className="w-full flex-shrink-0 border-b border-white/10 px-4 py-5 sm:px-6 xl:w-80 xl:border-b-0 xl:border-r xl:px-5 xl:py-10"
          style={{
            background: "linear-gradient(180deg, #2897A4 0%, #0F393E 91%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Avatar */}
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#0f393e] sm:h-24 sm:w-24 xl:h-25 xl:w-25">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              // Lucide UserCircle
              <LucideUserCircle 
              size={70} 
              color={"white"}
              />
            )}
          </div>

          {/* User badge + username */}
          <span className="mx-auto mb-1 block w-fit rounded-full bg-teal-700 px-3 py-0.5 text-xs font-semibold text-white sm:text-sm xl:text-md">
            {user?.role || "User"}
          </span>
          <p className="mb-4 text-center text-sm font-semibold text-white sm:mb-6 xl:mb-8 xl:text-md">
            {userDisplayName}
          </p>

          {/* Nav links */}
          <nav className="grid w-full grid-cols-1 gap-2 sm:gap-3 xl:space-y-5">
            <NavLink to="/dashboard/profile" end className={navCls}>
              {({ isActive }) => (
                <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                  <UserCircle
                    size={22}
                    stroke={isActive ? "#4ade80" : "currentColor"}
                    className="sm:h-6 sm:w-6 xl:h-7 xl:w-7"
                  />
                  <span className="text-base font-medium sm:text-lg xl:text-xl">Personal Information</span>
                </div>
              )}
            </NavLink>

            <NavLink to="/dashboard/bookings" className={navCls}>
              {({ isActive }) => (
                <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
                  <LucideClock
                    size={22}
                    stroke={isActive ? "#4ade80" : "currentColor"}
                    className="sm:h-6 sm:w-6 xl:h-7 xl:w-7"
                  />
                  <span className="text-base font-medium sm:text-lg xl:text-xl">Bookings</span>
                </div>
              )}
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white cursor-pointer sm:gap-3"
            >
              <LucideLogOut size={22} className="sm:h-6 sm:w-6 xl:h-7 xl:w-7" />
              <span className="text-base font-medium sm:text-lg xl:text-xl">Logout</span>
            </button>
          </nav>
        </aside>

        {/* ══════════════════════════
            MAIN CONTENT AREA
        ══════════════════════════ */}
        <main
          className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-16 xl:py-12 2xl:px-20"
          style={{
            background: "linear-gradient(180deg, #127A88 31%, #0D555F 87%)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
