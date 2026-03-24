import React, { useState, useEffect, useRef, useCallback } from "react";
import travelHeader from "../assets/images/TravelHeader.png";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAdminEvents } from "../services/adminService";


// MOCK DATA — Replace with real API calls when backend ready


// TODO: GET /api/divisions  (Divisions of Bangladesh)
const MOCK_DIVISIONS = [
  { id: 1, name: "Dhaka" },
  { id: 2, name: "Chittagong" },
  { id: 3, name: "Sylhet" },
  { id: 4, name: "Rajshahi" },
  { id: 5, name: "Khulna" },
  { id: 6, name: "Barishal" },
  { id: 7, name: "Mymensingh" },
  { id: 8, name: "Rangpur" },
];

// TODO: GET /api/communities
const MOCK_COMMUNITIES = ["Family", "Male", "Female", "Combined"];

// TODO: GET /api/cities
const MOCK_CITIES = [
  { id: 1, name: "Dhaka" },
  { id: 2, name: "Sreemangal" },
  { id: 3, name: "Cox's Bazar" },
  { id: 4, name: "Sylhet City" },
  { id: 5, name: "Bandarban" },
  { id: 6, name: "Rangamati" },
  { id: 7, name: "Khagrachhari" },
  { id: 8, name: "Sundarbans" },
  { id: 9, name: "Sajek" },
  { id: 10, name: "Kuakata" },
  { id: 11, name: "Maheshkhali" },
  { id: 12, name: "Ratargul" },
];


const PRICE_MIN = 0;
const PRICE_MAX = 25000;
const EVENTS_PER_PAGE = 6;

const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const parseEventDate = (dateText) => {
  if (!dateText) return null;
  const [dayText, monthText] = dateText.split(" ");
  const day = Number(dayText);
  const month = MONTH_INDEX[monthText];
  if (!Number.isFinite(day) || month === undefined) return null;
  return new Date(new Date().getFullYear(), month, day);
};

const isSelectedDateWithinEventRange = (selectedDate, fromText, toText) => {
  const from = parseEventDate(fromText);
  const to = parseEventDate(toText);
  if (!from || !to) return false;
  return selectedDate >= from && selectedDate <= to;
};
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