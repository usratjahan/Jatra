import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Explore from "./pages/Explore";
import Family from "./components/Community/Family";
import Male from "./components/Community/Male";
import Female from "./components/Community/Female";
import Combined from "./components/Community/Combined";
import ContactUs from "./pages/ContactUs";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ProfilePage from "./components/Dashboard/ProfilePage";
import BookingHistory from "./components/Dashboard/BookingHistory";
import UpdateProfile from "./components/Dashboard/UpdateProfile";
import EventDetails from "./pages/EventDetails";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import BookingPage from "./pages/BookingPage";
import AdminLogin from "./pages/AdminLogin";             // ← ADD
import AdminPanel from "./pages/AdminPanel";             // ← ADD
import { AdminAuthProvider } from "./context/AdminAuthContext"; // ← ADD

const UserLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminPanel />} />

          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route path="/explore" element={<Explore />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/community/family" element={<Family />} />
            <Route path="/community/male" element={<Male />} />
            <Route path="/community/female" element={<Female />} />
            <Route path="/community/combined" element={<Combined />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="bookings" element={<BookingHistory />} />
              <Route path="profile/edit" element={<UpdateProfile />} />
            </Route>
          </Route>
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;