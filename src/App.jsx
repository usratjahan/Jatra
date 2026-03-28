import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Family from "./components/Community/Family";
import Male from "./components/Community/Male";

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

</Route>
        </Routes>
        </BrowserRouter>
  );
  };
export default App;