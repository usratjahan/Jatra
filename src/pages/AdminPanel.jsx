// FILE: src/pages/AdminPanel.jsx
// Route: /admin/*  — shell with sidebar + content area

import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";
import AdminHeader from "../components/admin/layout/AdminHeader";
import AdminSidebar from "../components/admin/layout/AdminSidebar";
import AdminDashboard from "../components/admin/dasboard/AdminDashboard";
import UserInformation from "../components/admin/user/UserInformation";
import ContactInformation from "../components/admin/contact/ContactInformation";
import EventDetailsInformation from "../components/admin/events/EventDetailsInformation";
import RegisteredEvent from "../components/admin/registered/RegisteredEvent";
import AdminInformation from "../components/admin/admin/AdminInformation";
import Messages from "../components/admin/messeges/Messeges";

const AdminPanel = () => {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  if (!admin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onLogout={handleLogout}
      />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 min-h-[calc(100vh-132px)]">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserInformation />} />
              <Route path="contact" element={<ContactInformation />} />
              <Route path="events" element={<EventDetailsInformation />} />
              <Route path="registered" element={<RegisteredEvent />} />
              <Route path="settings" element={<AdminInformation />} />
              <Route path="messages" element={<Messages />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
