import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroBg from "../assets/images/Background.png";
import Cloud1 from "../assets/images/cloud-1.png";
import Cloud2 from "../assets/images/cloud-2.png";
 
const fetchHeroData = async () => ({
  title_line1: "Carried by clouds, guided by stars.",
  background_image: HeroBg,
});
 
const fetchCommunitiesData = async () => [
  {
    id: "family", href: "/community/family",
     title: "Family",
    subtitle: "Travel Together",
    description: "Safe and memorable trips designed for families of all sizes.",
    member_count: "2.4k families",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80",
    theme: { accent_color: "#f59e0b", badge_text: "#fbbf24", badge_bg: "rgba(245,158,11,0.15)", badge_border: "rgba(245,158,11,0.3)" },
  },
  {
    id: "male", href: "/community/male",
     title: "Male",
    subtitle: "Brotherhood Adventures",
    description: "Conquer mountains, deserts, and oceans with fellow explorers.",
    member_count: "5.1k travelers",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=700&q=80",
    theme: { accent_color: "#3b82f6", badge_text: "#60a5fa", badge_bg: "rgba(59,130,246,0.15)", badge_border: "rgba(59,130,246,0.3)" },
  },
  {
    id: "female", href: "/community/female", 
    title: "Female",
    subtitle: "Sisterhood Journeys",
    description: "Empowering women to explore the world with confidence.",
    member_count: "3.8k explorers",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80",
    theme: { accent_color: "#ec4899", badge_text: "#f472b6", badge_bg: "rgba(236,72,153,0.15)", badge_border: "rgba(236,72,153,0.3)" },
  },
  {
    id: "combined", href: "/community/combined", 
    title: "Combined",
    subtitle: "United Wanderers",
    description: "A diverse community for everyone — travel as one global family.",
    member_count: "9.2k members",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=80",
    theme: { accent_color: "#22c55e", badge_text: "#4ade80", badge_bg: "rgba(34,197,94,0.15)", badge_border: "rgba(34,197,94,0.3)" },
  },
];
 
/* 
   COMMUNITY CARD (your modern design)
 */
 
const CommunityCard = ({ comm, onHoverStart, onHoverEnd }) => {
  const [hovered, setHovered] = useState(false);
 
  return (
    <Link
      to={comm.href}
      onMouseEnter={() => { setHovered(true); onHoverStart?.(); }}
      onMouseLeave={() => { setHovered(false); onHoverEnd?.(); }}
      className="relative block w-full h-full"
      style={{
        transform: hovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div className="absolute -inset-6 rounded-[32px] blur-2xl"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${comm.theme.accent_color}55, transparent 65%)`,
          opacity: hovered ? 0.85 : 0.45,
          transition: "opacity 0.35s ease",
        }}
      />
      <div className="relative h-full rounded-[28px] p-[10px] border border-white/15 backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px ${comm.theme.accent_color}44`
            : "0 18px 52px rgba(0,0,0,0.60)",
          transition: "box-shadow 0.35s ease",
        }}
      >
        <div className="relative h-full overflow-hidden rounded-[20px] bg-black">
          <img src={comm.image} alt={comm.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.12)" : "scale(1)",
              transition: "transform 0.75s ease",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          <div className="absolute left-0 right-0 bottom-0 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: comm.theme.badge_text }}>
              {comm.subtitle}
            </p>
            <h3 className="text-white font-black text-2xl leading-tight">
              {comm.title}
              </h3>
            <p className="text-gray-200/90 text-sm leading-relaxed mt-2">
            {comm.description}
            </p>
           
            {/* mini bottom bar */}
            <div
              className="mt-4 rounded-2xl border border-white/15 backdrop-blur px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.10)" }}
            >
              <div className="flex-1">
                <p className="text-white/60 text-[10px]">Members</p>
                <p className="text-white text-sm font-bold">
                  {comm.member_count}
                  </p>
              </div>
              <div className="w-px h-8 bg-white/15 hidden sm:block" />
              <div className="hidden sm:block flex-1">
                <p className="text-white/60 text-[10px]">Type</p>
                <p className="text-white text-sm font-bold">
                  {comm.title}
                  </p>
              </div>
              <div
                className="ml-auto h-10 w-10 rounded-xl font-black text-white grid place-items-center"
                style={{
                  background: `linear-gradient(135deg, ${comm.theme.accent_color}, rgba(255,255,255,0.18))`,
                }}
              >
                Go
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm font-extrabold"
              style={{ color: comm.theme.badge_text }}>
              <span>Join Community</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
 
const Home = () => {
  const [heroData, setHeroData] = useState(null);
  const [communitiesData, setCommunitiesData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
 
  // for stacked layout responsiveness
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 1024 : true,
  );
 
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
 
  useEffect(() => {
    Promise.all([fetchHeroData(), fetchCommunitiesData()]).then(
      ([hero, communities]) => {
        setHeroData(hero);
        setCommunitiesData(communities);
        setTimeout(() => setLoaded(true), 80);
      },
    );
  }, []);
 
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#050508", minHeight: "100vh" }}>
      <section className="relative flex flex-col" style={{ minHeight: "100vh" }}>
        <div className="absolute inset-0 overflow-hidden">
          {heroData ? (
            <img src={heroData.background_image} alt="Hero background" className="fade-in"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#0a0f0a" }} />
          )}
          <div className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(5,5,8,0.70) 72%, rgba(5,5,8,0.97) 100%)",
            }}
          />
        </div>
 
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4"
          style={{ flexGrow: 1, paddingTop: "120px", paddingBottom: "100px" }}>
          {loaded && heroData && (
            <h1 className="hero-title fade-up d2 text-white"
              style={{ fontSize: "clamp(1rem, 4vw, 3rem)",
               marginBottom: "24px" }}>
              {heroData.title_line1}
            </h1>
          )}
        </div>
      </section>
    </div>
  );
};
export default Home;
