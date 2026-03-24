import React, { useState, useEffect, useRef, useCallback } from "react";
import travelHeader from "../assets/images/TravelHeader.png";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminEvents } from "../services/adminService";
const Events = () => {
  return (
    <div className="relative bg-[#edfffd] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-teal-700 font-bold text-xl">Events page coming soon...</p>
      </div>
    </div>
  );
};
 
export default Events;