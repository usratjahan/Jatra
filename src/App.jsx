import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Family from "./components/Community/Family";
import Male from "./components/Community/Male";
import Female from "./components/Community/Female";
import Combined from "./components/Community/Combined";
import Explore from "./pages/Explore";
import ContactUs from "./pages/ContactUs";

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
     <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/community/family" element={<Family />} />
            <Route path="/community/male" element={<Male />} />
            <Route path="/community/female" element={<Female />} />
            <Route path="/community/combined" element={<Combined />} />
           <Route path="/explore" element={<Explore />} />
           <Route path="/contact" element={<ContactUs />} />


</Route>
        </Routes>
        </BrowserRouter>
  );
  };
export default App;