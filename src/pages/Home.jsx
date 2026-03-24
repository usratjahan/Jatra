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
const Home = () => {
  return (
    <div style={{ background: "#050508", minHeight: "100vh" }}>
      <p style={{ color: "white", padding: "40px" }}>Home page loading...</p>
    </div>
  );
}

  


export default Home;
