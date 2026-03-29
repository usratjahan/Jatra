import React from "react";
import exploreHeader from "../assets/images/ExploreHeader.png";
import gallery from "../assets/images/gallery.png";

// ── Gallery images — replace with real paths or API
// TODO: GET /api/gallery → [{ id, src, alt }]
const GALLERY_IMAGES = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  src: new URL(`../assets/images/g${i + 1}.png`, import.meta.url).href,
  alt: `Gallery image ${i + 1}`,
}));

// ── Story text — replace with real content or API
// TODO: GET /api/about-story → { paragraph1, paragraph2 }
const STORY_PARAGRAPHS = [
  `Jatra started with a simple idea to make traveling easier, safer, and more organized for everyone. Many students and families want to travel but often face problems like unclear information, unorganized trips, or unreliable services. At the same time, many beautiful places and local communities do not get enough attention from travelers.`,
  `The name "Jatra" comes from the Bengali word for journey. It represents the experience of traveling, discovering new places, and creating memories along the way. To make traveling comfortable for different types of people, Jatra offers several group travel options such as female-only groups, male-only groups, combined groups, and family tours. This helps travelers choose the type of group where they feel more comfortable and safe.`,
  `Jatra started with a simple idea to make traveling easier, safer, and more organized for everyone. Many students and families want to travel but often face problems like unclear information, unorganized trips, or unreliable services. At the same time, many beautiful places and local communities do not get enough attention from travelers.`,
  `The name "Jatra" comes from the Bengali word for journey. It represents the experience of traveling, discovering new places, and creating memories along the way. To make traveling comfortable for different types of people, Jatra offers several group travel options such as female-only groups, male-only groups, combined groups, and family tours. This helps travelers choose the type of group where they feel more comfortable and safe.`,
];

const Explore = () => {
  return (
    <div className="bg-[#e8faf8] min-h-screen">
      {/* ══════════════════════════════════════════
          HERO HEADER — full width, no container
          Uses ExploreHeader.png (polaroid collage)
      ══════════════════════════════════════════ */}
      <div
        className="relative w-full  overflow-hidden"
        style={{ marginTop: "64px" }}
      >
        {/* Polaroid collage image — full bleed */}
        <img
          src={exploreHeader}
          alt="Our Story"
          className="w-full object-cover object-center"
          style={{ maxHeight: "509px", minHeight: "180px" }}
          // onError={(e) => {
          //   // fallback gradient if image missing
          //   e.target.style.display = "none";
          //   e.target.parentNode.style.background =
          //     "linear-gradient(135deg,#0f393e 0%,#0d7377 50%,#14a085 100%)";
          //   e.target.parentNode.style.minHeight = "220px";
          // }}
        />

        {/* "Our Story" text overlay — centred, bold white */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="text-white font-extrabold text-4xl sm:text-5xl drop-shadow-lg tracking-wide"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}
          >
            Our Story
          </h1>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CONTENT — max-w container
      ══════════════════════════════════════════ */}
      <div className="max-w-2xl container mx-auto px-4 sm:px-6 py-12">
        {/* ── Story Behind Jatra ── */}
        <section className="mb-14">
          <h2 className="text-gray-900 font-bold text-2xl text-center mb-6">
            Story Behind Jatra
          </h2>

          <div className="flex flex-col sm:flex-row gap-40 items-start">
            {/* Text */}
            <div className="flex-1 ">
              {STORY_PARAGRAPHS.map((para, i) => (
                <p
                  key={i}
                  className="text-gray-700 text-md leading-relaxed text-justify mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Story image — right side */}
            <div className="w-full sm:w-70 md:w-92 flex-shrink-0">
              <div className="rounded-2xl overflow-hidden shadow-md bg-teal-100 aspect-[469/703]">
                <img
                  src={gallery}
                  alt="Kayaking in Bangladesh"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.style.background =
                      "linear-gradient(160deg,#0d7377,#14a085)";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Our Gallery ── */}
        <section>
          <h2 className="text-gray-900 font-bold text-2xl text-center mb-6">
            Our Gallery
          </h2>

          {/* 3-column grid, 2 rows */}
          <div className="grid grid-cols-3 gap-15">
            {GALLERY_IMAGES.map((img) => (
              <div
                key={img.id}
                className="rounded-xl overflow-hidden bg-teal-100 shadow-sm hover:shadow-md transition-shadow duration-300 aspect-square group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  // onError={(e) => {
                  //   e.target.style.display = "none";
                  //   e.target.parentNode.style.background = `hsl(${170 + img.id * 12}, 45%, ${55 + img.id * 3}%)`;
                  // }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
