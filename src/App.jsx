import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
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
</Route>
        </Routes>
        </BrowserRouter>
  );
  };
export default App;