import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroBg from "../assets/images/Background.png";
import Cloud1 from "../assets/images/cloud-1.png";
import Cloud2 from "../assets/images/cloud-2.png";
import { getCommunityCounts } from "../services/eventsService";

/* ═══════════════════════════════════════════════════════════
   MOCK API  →  Replace with real fetch('/api/...') when ready
═══════════════════════════════════════════════════════════ */

const fetchHeroData = async () => ({
  title_line1: "Carried by clouds, guided by stars.",
  background_image: HeroBg,
  // cta_primary: { label: "Explore Now", href: "/explore" },
  // cta_secondary: { label: "View Events", href: "/events" },
});

const fetchCommunitiesData = async () => {
  // Fetch real event counts from API
  const counts = await getCommunityCounts();
  
  const communities = [
    {
      id: "family",
      href: "/community/family",
      title: "Family",
      subtitle: "Travel Together",
      description: "Safe and memorable trips designed for families of all sizes.",
      member_count: `${counts.Family} events`,
      image:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80",
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
      description:
        "Conquer mountains, deserts, and oceans with fellow explorers.",
      member_count: `${counts.Male} events`,
      image:
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=700&q=80",
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
      member_count: `${counts.Female} events`,
      image:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=700&q=80",
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
      description:
        "A diverse community for everyone — travel as one global family.",
      member_count: `${counts.Combined} events`,
      image:
        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=700&q=80",
      theme: {
        gradient: "from-green-500 to-emerald-500",
        accent_color: "#22c55e",
        badge_bg: "rgba(34,197,94,0.15)",
        badge_border: "rgba(34,197,94,0.3)",
        badge_text: "#4ade80",
      },
    },
  ];
  
  return communities;
};

/* ═══════════════════════════════════════════════════════════
   COMMUNITY CARD (your modern design)
═══════════════════════════════════════════════════════════ */

const CommunityCard = ({ comm, onHoverStart, onHoverEnd }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={comm.href}
      onMouseEnter={() => {
        setHovered(true);
        onHoverStart?.();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverEnd?.();
      }}
      onFocus={() => {
        setHovered(true);
        onHoverStart?.();
      }}
      onBlur={() => {
        setHovered(false);
        onHoverEnd?.();
      }}
      className="relative block w-full h-full"
      style={{
        transform: hovered
          ? "translateY(-10px) scale(1.02)"
          : "translateY(0) scale(1)",
        transition: "transform 0.45s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* soft glow behind */}
      <div
        className="absolute -inset-6 rounded-[32px] blur-2xl"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${comm.theme.accent_color}55, transparent 65%)`,
          opacity: hovered ? 0.85 : 0.45,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* glass frame */}
      <div
        className="relative h-full rounded-[28px] p-[10px] border border-white/15 backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px ${comm.theme.accent_color}44`
            : "0 18px 52px rgba(0,0,0,0.60)",
          transition: "box-shadow 0.35s ease",
        }}
      >
        <div className="relative h-full overflow-hidden rounded-[20px] bg-black">
          {/* bg image */}
          <img
            src={comm.image}
            alt={comm.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.12)" : "scale(1)",
              transition: "transform 0.75s ease",
              filter: "saturate(1.05)",
            }}
            draggable="false"
          />
          {/* Cloud layer 1 */}

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${comm.theme.accent_color}22, transparent 55%)`,
            }}
          />

          {/* top bar */}
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-full border border-white/15 backdrop-blur flex items-center justify-center text-white text-xs font-black"
                style={{ background: "rgba(255,255,255,0.10)" }}
              >
                T
              </div>
              <span className="hidden sm:block text-white/75 text-xs font-semibold">
                Community
              </span>
            </div>

            {/* <div className="hidden sm:flex items-center gap-3 text-white/70 text-[11px]">
              <span className="hover:text-white transition">Home</span>
              <span className="hover:text-white transition">Tours</span>
              <span className="hover:text-white transition">Blog</span>
            </div>

            <div
              className="h-8 px-3 rounded-full border border-white/15 backdrop-blur text-white/80 text-xs flex items-center"
              style={{ background: "rgba(255,255,255,0.10)" }}
            >
              🔍
            </div> */}
          </div>

          {/* badge */}
          {/* <div className="absolute top-4 right-4 mt-10">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: comm.theme.badge_bg,
                border: `1px solid ${comm.theme.badge_border}`,
                color: comm.theme.badge_text,
                backdropFilter: "blur(10px)",
              }}
            >
              {comm.member_count}
            </span>
          </div> */}

          {/* content bottom */}
          <div className="absolute left-0 right-0 bottom-0 p-6">
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2"
              style={{ color: comm.theme.badge_text }}
            >
              {comm.subtitle}
            </p>

            <h3 className="text-white font-black text-2xl leading-tight">
              {comm.title}
            </h3>

            <p
              className="text-gray-200/90 text-sm leading-relaxed mt-2"
              style={{
                opacity: hovered ? 1 : 0.72,
                transition: "opacity 0.25s ease",
              }}
            >
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
                <p className="text-white text-sm font-bold">{comm.title}</p>
              </div>

              <div
                className="ml-auto h-10 w-10 rounded-xl font-black text-white grid place-items-center"
                style={{
                  background: `linear-gradient(135deg, ${comm.theme.accent_color}, rgba(255,255,255,0.18))`,
                }}
                aria-label="Join"
                title="Join Community"
              >
                Go
              </div>
            </div>

            {/* CTA */}
            <div
              className="mt-4 flex items-center gap-2 text-sm font-extrabold"
              style={{
                color: comm.theme.badge_text,
                transform: hovered ? "translateX(6px)" : "translateX(0)",
                transition: "transform 0.25s ease",
              }}
            >
              <span>Join Community</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>

          {/* shine */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-52 w-52 rotate-12 bg-white/10 blur-2xl" />
        </div>
      </div>
    </Link>
  );
};

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */

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
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#050508",
        minHeight: "100vh",
      }}
    >
      <section
        className="relative flex flex-col"
        style={{ minHeight: "100vh" }}
      >
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {heroData ? (
            <img
              src={heroData.background_image}
              alt="Hero background"
              className="fade-in"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ) : (
            <div
              style={{ width: "100%", height: "100%", background: "#0a0f0a" }}
            />
          )}

          {/* ================= CLOUDS GO HERE ================= */}

          {/* Cloud layer 1 (slow) */}
          <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-[2]">
            <div className="animate-moveCloud">
              <img
                src={Cloud2}
                alt="cloud"
                className="w-[700px] opacity-80"
              />
            </div>
          </div>

          {/* Cloud layer 2 (fast) */}
          <div className="absolute top-24 left-0 w-full overflow-hidden pointer-events-none z-[2] opacity-70">
            <div className="animate-moveCloudFast">
              <img
                src={Cloud1}
                alt="cloud"
                className="w-[600px]"
              />
            </div>
          </div>
          
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(5,5,8,0.70) 72%, rgba(5,5,8,0.97) 100%)",
            }}
          />
        </div>

        {/* Hero text */}
        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-4"
          style={{
            flexGrow: 1,
            paddingTop: "120px",
            paddingBottom: "100px",
          }}
        >
          {loaded && heroData && (
            <h1
              className="hero-title fade-up d2 text-white"
              style={{
                fontSize: "clamp(1rem, 4vw, 3rem)",
                marginBottom: "24px",
              }}
            >
              {heroData.title_line1}
              <br />
              <span className="gradient-text italic">
                {heroData.title_line2}
              </span>
            </h1>
          )}


        </div>

        {/* Cards section (STACKED / OVERLAP) */}
        <div
          className="relative z-10 w-full"
          style={{ padding: "0 20px 60px" }}
        >
          {loaded && (
            <div
              className="fade-up d4 text-center"
              style={{ marginBottom: 24 }}
            >
              <span
                style={{
                  color: "rgba(200,210,200,0.7)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Choose Your Community
              </span>
              <div
                style={{
                  marginTop: 8,
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: 48,
                  height: 2,
                  borderRadius: 2,
                  background: "linear-gradient(to right, #22c55e, transparent)",
                }}
              />
            </div>
          )}

          {loaded && communitiesData ? (
            <div
              style={{ maxWidth: 1280, margin: "0 auto", overflow: "hidden" }}
            >
              <div className="cards-stack">
                {communitiesData.map((comm, i) => {
                  const lefts = ["1%", "24%", "47%", "71%"];
                  const tops = ["3%", "18%", "10%", "3%"];
                  const tilts = [
                    "rotate(-2deg)",
                    "rotate(1deg)",
                    "rotate(-1deg)",
                    "rotate(1deg)",
                  ];

                  return (
                    <div
                      key={comm.id}
                      className={`card-wrap cw${i + 1}`}
                      style={{
                        position: isDesktop ? "absolute" : "relative",
                        zIndex: activeCardId === comm.id ? 100 : 10 + i,
                        width: isDesktop ? "clamp(220px, 24vw, 360px)" : "100%",
                        height: 360,
                        left: isDesktop ? lefts[i] : "auto",
                        top: isDesktop ? tops[i] : "auto",
                        transform: isDesktop ? tilts[i] : "none",
                      }}
                    >
                      <CommunityCard
                        comm={comm}
                        onHoverStart={() => setActiveCardId(comm.id)}
                        onHoverEnd={() =>
                          setActiveCardId((prev) =>
                            prev === comm.id ? null : prev,
                          )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              style={{ maxWidth: 1300, margin: "0 auto", overflow: "hidden" }}
            >
              <div className="cards-stack">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
