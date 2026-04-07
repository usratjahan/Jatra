// FILE: src/components/admin/layout/AdminSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

const MENU = [
  { label: "DashBoard", to: "/admin/dashboard" },
  { label: "User Information", to: "/admin/users" },
  { label: "Contact Information", to: "/admin/contact" },
  { label: "Event Details Information", to: "/admin/events" },
  { label: "Registered Event", to: "/admin/registered" },
  { label: "Admin Information", to: "/admin/settings" },
  { label: "Messages", to: "/admin/messages" },
];

const AdminSidebar = ({ isOpen = false, onClose = () => {} }) => (
  <>
    <div
      className={`fixed inset-0 z-40 bg-gray-900/40 transition-opacity duration-200 lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={onClose}
      aria-hidden="true"
    />

    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-gray-200 bg-white p-4 shadow-xl transition-transform duration-200 lg:sticky lg:top-[88px] lg:z-auto lg:w-60 lg:max-h-[calc(100vh-104px)] lg:translate-x-0 lg:overflow-visible lg:rounded-xl lg:border lg:shadow-sm ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:self-start`}
      aria-label="Admin navigation"
    >
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm font-extrabold text-gray-900">Navigation</p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600"
          aria-label="Close admin menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav className="space-y-1.5">
        {MENU.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-[#b2dfdb] font-semibold text-teal-900"
                  : "bg-[#e0f2f1] text-gray-700 hover:bg-[#b2dfdb] hover:text-teal-900"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default AdminSidebar;
