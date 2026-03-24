import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroBg from "../assets/images/Background.png";
import Cloud1 from "../assets/images/cloud-1.png";
import Cloud2 from "../assets/images/cloud-2.png";

   /*     MOCK API  →  Replace with real fetch('/api/...') when ready       */
const fetchHeroData = async () => ({
  title_line1: "Carried by clouds, guided by stars.",
  background_image: HeroBg,
  // cta_primary: { label: "Explore Now", href: "/explore" },
  // cta_secondary: { label: "View Events", href: "/events" },
});
const fetchCommunitiesData = async () => [
  {
    id: "family",
    href: "/community/family",
    title: "Family",
    subtitle: "Travel Together",
    description: "Safe and memorable trips designed for families of all sizes.",
    member_count: "2.4k families",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80",
    theme: {
      gradient: "from-amber-500 to-orange-500",
      accent_color: "#f59e0b",
      badge_bg: "rgba(245,158,11,0.15)",
      badge_border: "rgba(245,158,11,0.3)",
      badge_text: "#fbbf24",
    },
  },
  {
    id: "male",
    href: "/community/male",
    title: "Male",
    subtitle: "Brotherhood Adventures",
    description: "Conquer mountains, deserts, and oceans with fellow explorers.",
    member_count: "5.1k travelers",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=700&q=80",
    theme: {
      gradient: "from-blue-500 to-cyan-500",
      accent_color: "#3b82f6",
      badge_bg: "rgba(59,130,246,0.15)",
      badge_border: "rgba(59,130,246,0.3)",
      badge_text: "#60a5fa",
    },
  },
  {
    id: "female",
    href: "/community/female",
    title: "Female",
    subtitle: "Sisterhood Journeys",
    description: "Empowering women to explore the world with confidence.",
    member_count: "3.8k explorers",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80",
    theme: {
      gradient: "from-pink-500 to-rose-500",
      accent_color: "#ec4899",
      badge_bg: "rgba(236,72,153,0.15)",
      badge_border: "rgba(236,72,153,0.3)",
      badge_text: "#f472b6",
    },
  },
  {
    id: "combined",
    href: "/community/combined",
    title: "Combined",
    subtitle: "United Wanderers",
    description: "A diverse community for everyone — travel as one global family.",
    member_count: "9.2k members",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=80",
    theme: {
      gradient: "from-green-500 to-emerald-500",
      accent_color: "#22c55e",
      badge_bg: "rgba(34,197,94,0.15)",
      badge_border: "rgba(34,197,94,0.3)",
      badge_text: "#4ade80",
    },
  },
];
 
const Home = () => {
  return (
    <div style={{ background: "#050508", minHeight: "100vh" }}>
      <p style={{ color: "white", padding: "40px" }}>Home page loading...</p>
    </div>
  );
};
export default Home;
