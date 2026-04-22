// ═══════════════════════════════════════════════════════════════
// FILE: src/data/MOCK_EVENTS_DETAIL.js
//
// 24 events — 6 per community:
//   Family   → id: 1–6
//   Male     → id: 7–12
//   Female   → id: 13–18
//   Combined → id: 19–24
//
// How to use in community pages:
//   import { getEventsByCommunity } from "../data/MOCK_EVENTS_DETAIL";
//   const events = getEventsByCommunity("Male"); // or Family/Female/Combined
//
// How to use in EventDetail page:
//   import { getEventById } from "../data/MOCK_EVENTS_DETAIL";
//   const event = getEventById(id);  // id from useParams()
//
// TODO: Replace with real API → GET /api/events and GET /api/events/:id
// ═══════════════════════════════════════════════════════════════

import { getTours, getTourById } from '../services/apiService.js';

const STANDARD_TERMS = {
  general: [
    "By booking or joining any event through Jatra, you agree to follow the rules and guidelines of the platform.",
    "Tour Booking: All bookings depend on the availability of seats and tour schedules.",
    "Payments must be completed through the approved payment methods. Incomplete payments may result in cancellation.",
    "Minimum Participant Requirement: Each event requires a minimum number of participants. If not reached, the event may be postponed or cancelled.",
  ],
  cancellationPolicy: {
    title: "Cancellation & Refund Policy",
    intro: "Participants may cancel their booking according to the following policy:",
    points: [
      "If the cancellation is made 7 days or more before the event, 80% of the payment will be refunded.",
      "If the cancellation is made between 3 to 6 days before the event, 50% of the payment will be refunded.",
      "If the cancellation is made within 48 hours of the event, no refund will be provided.",
      "If the event is cancelled by the organizer, participants will have the option to receive a full refund or transfer their booking(s) to another available event.",
    ],
  },
  liability:
    "Jatra works as a platform connecting users and agents. While we try to ensure good service, we are not responsible for any personal injury, loss, or damage that may occur during the tour.",
  contact:
    "For any questions regarding events or bookings, users can contact us through the website's contact page.",
};

export const MOCK_EVENTS_DETAIL = [

  // ╔══════════════════════════════════════════════════════════╗
  // ║                   FAMILY  (id: 1–6)                     ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 1,
    title: "Sylhet Tea Garden Family Tour",
    location: "Sylhet",
    sublocation: "Sreemangal",
    description:
      "Explore the lush green tea gardens of Sreemangal — the tea capital of Bangladesh — on this perfect family getaway. Walk through scenic plantations, visit Lawachara National Park, and discover the warm culture of Sylhet together.",
    price: 9000,
    priceForForeignGuests: 12000,
    dateFrom: "12 May",
    dateTo: "16 May",
    time: "09:00",
    spotsLeft: 10,
    days: 4,
    nights: 3,
    rating: 4.8,
    reviewCount: 128,
    image: "/assets/images/tour/style1/pic1.jpg",
    images: ["/assets/images/tour/style1/pic1.jpg", "/assets/images/tour/style1/pic3.jpg"],
    community: "Family",
    division: "Sylhet",
    itinerary: [
      { day: 1, title: "Arrival & Tea Estate Orientation", description: "Check in to the resort and head to Finlay Tea Estate for an evening orientation walk. Meet your guides and learn about tea cultivation from local workers. Overnight stay in Sreemangal." },
      { day: 2, title: "Lawachara National Park", description: "Guided nature walk through Lawachara National Park. Spot hoolock gibbons, monkeys, and colorful birds in the tropical rainforest. Return to hotel for rest." },
      { day: 3, title: "Madhabbpur Lake & Tea Factory", description: "Visit stunning Madhabbpur Lake with its water lily carpet, then tour a working tea factory to see the leaf-to-cup process. Evening local market exploration." },
      { day: 4, title: "Baiker Haor & Departure", description: "Early morning bird watching at Baiker Haor wetland. Collect your Sreemangal tea souvenir pack. Departure after checkout." },
    ],
    inclusions: [
      "3 nights accommodation in a standard resort/hotel",
      "Daily breakfast during the stay",
      "Transportation for all sightseeing tours",
      "Guided Lawachara National Park walk",
      "Tea factory guided visit",
      "Madhabbpur Lake visit",
      "Experienced local tour guide",
      "All internal transfers during the tour",
    ],
    exclusions: [
      "Food not mentioned in the package",
      "Personal spending (shopping, snacks, etc.)",
      "Entry tickets for parks or tourist places",
      "Extra activities not included in the plan",
      "Travel insurance",
      "Transport to and from Sreemangal",
    ],
    disclaimer:
      "The itinerary may change due to weather or road conditions. The organizers are not responsible for personal loss or injury. Travelers must follow guide instructions and respect local rules.",
    terms: STANDARD_TERMS,
    avgRating: 4.8,
    reviews: [
      { id: 1, userName: "Tasnim Sultana",  rating: 5, date: "2026-02-28", comment: "Perfect family trip! Kids loved the tea garden walk and the wildlife in Lawachara was amazing." },
      { id: 2, userName: "Nafisa Akter",    rating: 5, date: "2026-02-12", comment: "Wonderfully organized. The guide was very knowledgeable and the eco-resort was charming." },
      { id: 3, userName: "Arif Chowdhury", rating: 4, date: "2026-01-20", comment: "Beautiful destination. Madhabbpur Lake was gorgeous. Overall a great family experience." },
    ],
  },

  {
    id: 2,
    title: "Sundarbans Family Safari",
    location: "Sundarbans",
    sublocation: "Khulna",
    description:
      "Cruise through the world's largest mangrove forest with your family and spot Royal Bengal Tigers, spotted deer, and exotic birds. A UNESCO World Heritage experience that the whole family will never forget.",
    price: 18000,
    priceForForeignGuests: 25000,
    dateFrom: "10 Jun",
    dateTo: "14 Jun",
    time: "10:00",
    spotsLeft: 6,
    days: 4,
    nights: 3,
    rating: 5.0,
    reviewCount: 88,
    image: "/assets/images/tour/style1/pic4.jpg",
    images: ["/assets/images/tour/style1/pic4.jpg", "/assets/images/tour/style1/pic6.jpg"],
    community: "Family",
    division: "Khulna",
    itinerary: [
      { day: 1, title: "Arrival in Khulna & Boat Departure", description: "Board the tour vessel in Khulna. Cruise into the Sundarbans at sunset. Evening briefing on wildlife safety and spotting techniques." },
      { day: 2, title: "Tiger Territory & River Safari", description: "Morning forest walk with armed rangers. Look for Bengal tigers, spotted deer, and monitor lizards. Afternoon boat safari through narrow creeks." },
      { day: 3, title: "Kotka Beach & Bird Watching", description: "Visit Kotka Beach inside the Sundarbans. Morning bird watching session with 300+ species possible. Afternoon forest channel cruise." },
      { day: 4, title: "Return Journey & Departure", description: "Early morning river cruise back to Khulna. Breakfast on the boat. Arrive by midday. Debrief and departure." },
    ],
    inclusions: [
      "3 nights onboard vessel accommodation",
      "All meals onboard during the tour",
      "Guided day and river safari",
      "Armed forest ranger escort",
      "All boat transfers inside the Sundarbans",
      "Sundarbans entry permits",
      "Experienced wildlife guide",
      "Kotka Beach visit",
    ],
    exclusions: [
      "Transport to and from Khulna",
      "Personal spending",
      "Travel insurance",
      "Tips for guides and crew",
      "Medical expenses",
    ],
    disclaimer:
      "Wildlife sightings including tigers are not guaranteed. Safety instructions must be followed strictly at all times. Tour may be modified due to forest department restrictions or severe weather.",
    terms: STANDARD_TERMS,
    avgRating: 5.0,
    reviews: [
      { id: 1, userName: "Ziaur Rahman",   rating: 5, date: "2026-03-02", comment: "We actually spotted a Bengal tiger on day 2! The guide was phenomenal and kept everyone safe." },
      { id: 2, userName: "Kamrul Hassan",  rating: 5, date: "2026-02-18", comment: "Best family trip ever. Kids were amazed by the wildlife. Sleeping on the boat was unforgettable." },
      { id: 3, userName: "Sazzad Hossain", rating: 5, date: "2026-01-22", comment: "Flawless organization. Kotka Beach was stunning. Highly recommended for families." },
    ],
  },

  {
    id: 3,
    title: "Cox's Bazar Family Beach Package",
    location: "Cox's Bazar",
    sublocation: "Chittagong",
    description:
      "Family-friendly beach holiday at the world's longest natural sea beach. Enjoy safe swimming, Himchari waterfall, a boat trip to Maheshkhali Island, and fresh seafood — perfect for every member of the family.",
    price: 14000,
    priceForForeignGuests: 19000,
    dateFrom: "1 Jul",
    dateTo: "5 Jul",
    time: "08:30",
    spotsLeft: 8,
    days: 4,
    nights: 3,
    rating: 4.7,
    reviewCount: 165,
    image: "/assets/images/tour/style1/pic2.jpg",
    images: ["/assets/images/tour/style1/pic2.jpg", "/assets/images/tour/style1/pic5.jpg"],
    community: "Family",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Beach Orientation", description: "Check in to family resort. Evening orientation walk along the main beach. Seafood dinner at a beachside restaurant." },
      { day: 2, title: "Himchari National Park & Waterfall", description: "Morning hike to Himchari National Park. Visit the scenic waterfall. Afternoon beach time with family activities." },
      { day: 3, title: "Maheshkhali Island Boat Tour", description: "Boat trip to Maheshkhali Island. Visit Adinath Temple and salt fields. Local seafood lunch on the island." },
      { day: 4, title: "Inani Beach & Departure", description: "Morning visit to Inani Beach with unique coral stones. Souvenir shopping before checkout. Departure after lunch." },
    ],
    inclusions: [
      "3 nights family resort accommodation",
      "Daily breakfast",
      "All sightseeing transportation",
      "Himchari National Park guided visit",
      "Maheshkhali Island boat tour",
      "Inani Beach visit",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner (except noted)",
      "Personal spending",
      "Entry tickets",
      "Travel insurance",
      "Transport to/from Cox's Bazar",
    ],
    disclaimer:
      "Beach conditions can vary. Children must be supervised near the water at all times. The organizers are not responsible for weather-related changes.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Rakib Hossain", rating: 5, date: "2026-02-10", comment: "The whole family had an amazing time. Beach was beautiful and kids loved Maheshkhali!" },
      { id: 2, userName: "Fatema Begum",  rating: 4, date: "2026-01-28", comment: "Very well organized. The boat tour was the highlight. Accommodation was comfortable." },
      { id: 3, userName: "Tanvir Ahmed",  rating: 5, date: "2026-01-15", comment: "Inani Beach was stunning. A perfectly managed family trip." },
    ],
  },

  {
    id: 4,
    title: "Rangamati Lake Family Cruise",
    location: "Rangamati",
    sublocation: "Chittagong Hill Tracts",
    description:
      "Explore the serene Kaptai Lake — the largest man-made lake in Bangladesh — surrounded by lush hills and tribal villages. A gentle, family-friendly cruise with hanging bridges, waterfalls, and hill tribe culture.",
    price: 11000,
    priceForForeignGuests: 15000,
    dateFrom: "20 Aug",
    dateTo: "23 Aug",
    time: "09:00",
    spotsLeft: 14,
    days: 3,
    nights: 2,
    rating: 4.6,
    reviewCount: 112,
    image: "/assets/images/tour/style1/pic5.jpg",
    images: ["/assets/images/tour/style1/pic5.jpg", "/assets/images/tour/style1/pic1.jpg"],
    community: "Family",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Kaptai Lake Sunset Cruise", description: "Arrive in Rangamati and check in. Evening boat cruise on Kaptai Lake to watch the sunset over the hills." },
      { day: 2, title: "Tribal Village & Hanging Bridge", description: "Morning visit to a Chakma tribal village. Cross the famous hanging bridge. Afternoon lake-side relaxation for the family." },
      { day: 3, title: "Shuvolong Waterfall & Departure", description: "Boat trip to the scenic Shuvolong Waterfall. Return for checkout and departure." },
    ],
    inclusions: [
      "2 nights lake-view accommodation",
      "Daily breakfast",
      "Kaptai Lake sunset cruise",
      "Tribal village guided visit",
      "Hanging bridge visit",
      "Shuvolong Waterfall boat trip",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Rangamati",
    ],
    disclaimer:
      "Life jackets must be worn during all boat rides. Children must be accompanied by adults on the water. Waterfall visit depends on water levels.",
    terms: STANDARD_TERMS,
    avgRating: 4.6,
    reviews: [
      { id: 1, userName: "Shirin Akter",  rating: 5, date: "2026-02-15", comment: "The lake cruise at sunset was breathtaking. Kids loved the hanging bridge!" },
      { id: 2, userName: "Babul Hossain", rating: 4, date: "2026-01-30", comment: "Great family destination. Shuvolong Waterfall was magnificent." },
    ],
  },

  {
    id: 5,
    title: "Old Dhaka Heritage Family Walk",
    location: "Dhaka",
    sublocation: "Old Dhaka",
    description:
      "Discover the rich Mughal heritage of Old Dhaka — mosques, rivers, and the famous street food of Chawkbazar. A one-day cultural experience perfect for families with children of all ages.",
    price: 3500,
    priceForForeignGuests: 5000,
    dateFrom: "20 Jun",
    dateTo: "21 Jun",
    time: "08:00",
    spotsLeft: 25,
    days: 1,
    nights: 0,
    rating: 4.5,
    reviewCount: 210,
    image: "/assets/images/tour/style1/pic5.jpg",
    images: ["/assets/images/tour/style1/pic5.jpg", "/assets/images/tour/style1/pic2.jpg"],
    community: "Family",
    division: "Dhaka",
    itinerary: [
      { day: 1, title: "Old Dhaka Full Day Cultural Tour", description: "Morning visit to Lalbagh Fort and Ahsan Manzil (Pink Palace). Afternoon rickshaw ride through the narrow lanes of Chawkbazar. Evening boat ride on the Buriganga River. Street food tasting included." },
    ],
    inclusions: [
      "Lalbagh Fort and Ahsan Manzil entry tickets",
      "Rickshaw ride through Old Dhaka",
      "Buriganga River evening boat ride",
      "Street food tasting (Chawkbazar)",
      "Experienced local guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal spending",
      "Travel insurance",
      "Transport to/from starting point",
    ],
    disclaimer:
      "Old Dhaka streets can be very crowded. Children must be kept close at all times. The guide will always stay with the group.",
    terms: STANDARD_TERMS,
    avgRating: 4.5,
    reviews: [
      { id: 1, userName: "Muna Islam",     rating: 5, date: "2026-03-01", comment: "Such a wonderful way to learn Dhaka's history. Kids were fascinated by Lalbagh Fort!" },
      { id: 2, userName: "Sabbir Hossain", rating: 4, date: "2026-02-10", comment: "Fun and educational. The street food tasting was the highlight of the day." },
      { id: 3, userName: "Laila Banu",     rating: 5, date: "2026-01-25", comment: "Best day trip for families. The boat ride on Buriganga at sunset was magical." },
    ],
  },

  {
    id: 6,
    title: "Kuakata Family Beach Retreat",
    location: "Kuakata",
    sublocation: "Barishal",
    description:
      "Watch both sunrise and sunset from the same beach on this family-friendly coastal retreat. Kuakata offers safe beaches, a Rakhaine tribal village, mangrove forest, and fresh seafood — a peaceful escape for the whole family.",
    price: 8500,
    priceForForeignGuests: 11500,
    dateFrom: "15 Sep",
    dateTo: "18 Sep",
    time: "09:30",
    spotsLeft: 15,
    days: 3,
    nights: 2,
    rating: 4.6,
    reviewCount: 143,
    image: "/assets/images/tour/style1/pic6.jpg",
    images: ["/assets/images/tour/style1/pic6.jpg", "/assets/images/tour/style1/pic4.jpg"],
    community: "Family",
    division: "Barishal",
    itinerary: [
      { day: 1, title: "Arrival & Sunset Walk", description: "Arrive in Kuakata and check in. Evening sunset walk along the beach. Seafood dinner at a local restaurant." },
      { day: 2, title: "Sunrise & Rakhaine Village", description: "Early sunrise on the beach. Boat tour to mangrove forest. Visit Rakhaine tribal village and Buddhist temple." },
      { day: 3, title: "Gangamati Forest & Departure", description: "Morning nature walk in Gangamati Reserved Forest. Checkout and departure after lunch." },
    ],
    inclusions: [
      "2 nights beachside accommodation",
      "Daily breakfast",
      "Mangrove forest boat tour",
      "Rakhaine village and temple visit",
      "Gangamati forest guided walk",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Kuakata",
    ],
    disclaimer:
      "Coastal weather can be unpredictable. Sunrise and sunset visibility depend on weather. Itinerary may be adjusted for safety.",
    terms: STANDARD_TERMS,
    avgRating: 4.6,
    reviews: [
      { id: 1, userName: "Mahbub Alam", rating: 5, date: "2026-02-20", comment: "Watching sunrise and sunset from the same beach with my kids was unforgettable." },
      { id: 2, userName: "Riya Akter",  rating: 4, date: "2026-02-05", comment: "Good experience. The mangrove boat tour was amazing. Kids loved the tribal village." },
      { id: 3, userName: "Karim Uddin", rating: 5, date: "2026-01-10", comment: "Loved every moment. Perfectly organized for families." },
    ],
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║                    MALE  (id: 7–12)                     ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 7,
    title: "Bandarban Hill Trek",
    location: "Bandarban",
    sublocation: "Chittagong Hill Tracts",
    description:
      "Trek through rugged hills, hidden waterfalls, and tribal villages of Bandarban — the roof of Bangladesh. Experience indigenous culture and panoramic mountain views on this men's adventure.",
    price: 7500,
    priceForForeignGuests: 10000,
    dateFrom: "1 Jun",
    dateTo: "4 Jun",
    time: "07:00",
    spotsLeft: 8,
    days: 3,
    nights: 2,
    rating: 4.7,
    reviewCount: 96,
    image: "/assets/images/tour/style1/pic3.jpg",
    images: ["/assets/images/tour/style1/pic3.jpg", "/assets/images/tour/style1/pic5.jpg"],
    community: "Male",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Nilgiri Viewpoint", description: "Check in to guesthouse and head to Nilgiri viewpoint for orientation. Evening briefing and dinner at a local café." },
      { day: 2, title: "Lawachara Trek & Tribal Village", description: "Full day guided trek in Lawachara National Park. Visit a tribal village and learn about indigenous culture." },
      { day: 3, title: "Nakhal Pass Sunrise & Departure", description: "Early morning hike to Nakhal Pass for sunrise. Visit local tea estate. Scenic drive back and departure." },
    ],
    inclusions: [
      "2 nights guesthouse accommodation",
      "Daily breakfast",
      "All sightseeing transportation",
      "Nilgiri viewpoint visit",
      "Lawachara Park guided trek",
      "Tribal village visit",
      "Experienced trekking guide",
      "All internal transfers",
    ],
    exclusions: [
      "Food not in package",
      "Personal spending",
      "Entry tickets",
      "Travel insurance",
      "Transport to/from Bandarban",
    ],
    disclaimer:
      "Trekking conditions may vary due to weather. Participants must be physically fit. The organizers are not responsible for injuries during the trek.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Shahriar Kabir", rating: 5, date: "2026-03-01", comment: "Best trekking experience of my life! The Nilgiri sunrise was worth every step." },
      { id: 2, userName: "Imran Hossain",  rating: 4, date: "2026-02-14", comment: "Great trek. Accommodation was basic but fine for adventure travel." },
      { id: 3, userName: "Rafiul Islam",   rating: 5, date: "2026-01-30", comment: "Incredible forest walk. We even spotted a hoolock gibbon!" },
    ],
  },

  {
    id: 8,
    title: "Sajek Valley Cloud Trek",
    location: "Sajek",
    sublocation: "Rangamati",
    description:
      "Walk above the clouds in the breathtaking Sajek Valley — the Darjeeling of Bangladesh. Experience magical clouds rolling through the valleys, tribal culture, and stunning hilltop views on this 2-day adventure.",
    price: 6500,
    priceForForeignGuests: 9000,
    dateFrom: "5 Jul",
    dateTo: "7 Jul",
    time: "06:30",
    spotsLeft: 12,
    days: 2,
    nights: 1,
    rating: 4.8,
    reviewCount: 175,
    image: "/assets/images/tour/style1/pic5.jpg",
    images: ["/assets/images/tour/style1/pic5.jpg", "/assets/images/tour/style1/pic3.jpg"],
    community: "Male",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Sunset at Ruilui Para", description: "Arrive at Sajek. Check in to resort and head to Ruilui Para viewpoint for cloud-covered sunset. Evening bonfire." },
      { day: 2, title: "Sunrise at Konglak Para & Departure", description: "Pre-dawn hike to Konglak Para. Watch clouds fill the valleys. Tribal village visit after breakfast. Departure after lunch." },
    ],
    inclusions: [
      "1 night resort accommodation",
      "Daily breakfast",
      "Guided viewpoint tours (Ruilui Para & Konglak Para)",
      "Evening bonfire",
      "Tribal village visit",
      "Local guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Sajek",
    ],
    disclaimer:
      "Cloud views are weather-dependent and cannot be guaranteed. Bring warm clothing for early morning. Hill roads can be rough.",
    terms: STANDARD_TERMS,
    avgRating: 4.8,
    reviews: [
      { id: 1, userName: "Farhad Hossain", rating: 5, date: "2026-02-20", comment: "Watching clouds below my feet at Konglak Para was surreal. Incredible experience." },
      { id: 2, userName: "Naeem Islam",    rating: 5, date: "2026-02-05", comment: "Perfect 2-day escape. The bonfire at night with that view was unforgettable." },
      { id: 3, userName: "Emon Chowdhury", rating: 4, date: "2026-01-18", comment: "Beautiful destination. Tribal village visit added great cultural depth to the trip." },
    ],
  },

  {
    id: 9,
    title: "Khagrachhari Adventure Camp",
    location: "Khagrachhari",
    sublocation: "Chittagong Hill Tracts",
    description:
      "Camping, rappelling, and night trekking in the remote hills of Khagrachhari. This 3-day adventure camp is designed for thrill-seekers who want to experience the raw beauty of the hill tracts.",
    price: 8500,
    priceForForeignGuests: 12000,
    dateFrom: "15 Aug",
    dateTo: "18 Aug",
    time: "06:00",
    spotsLeft: 10,
    days: 3,
    nights: 2,
    rating: 4.6,
    reviewCount: 88,
    image: "/assets/images/tour/style1/pic3.jpg",
    images: ["/assets/images/tour/style1/pic3.jpg", "/assets/images/tour/style1/pic1.jpg"],
    community: "Male",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Camp Setup & Rappelling", description: "Arrive and set up camp near Alutila Cave. Afternoon rappelling session on the hillside with safety harnesses and expert supervision. Night camp under the stars." },
      { day: 2, title: "Alutila Cave & Night Trek", description: "Morning exploration of the famous Alutila Cave with torches. Afternoon rest. Night trekking expedition through forest trails with flashlights." },
      { day: 3, title: "Waterfall Hike & Departure", description: "Hike to a hidden waterfall for a morning swim. Pack up camp and depart after an outdoor breakfast." },
    ],
    inclusions: [
      "2 nights camping with tents",
      "All meals at camp (breakfast, lunch, dinner)",
      "Rappelling equipment and safety harnesses",
      "Alutila Cave guided tour",
      "Night trek with experienced guide",
      "Waterfall hike",
      "Experienced adventure guide",
    ],
    exclusions: [
      "Personal spending",
      "Travel insurance",
      "Medical expenses",
      "Transport to/from Khagrachhari",
    ],
    disclaimer:
      "Adventure activities involve physical risk. Participants must be in good health. Medical conditions must be disclosed before booking. The organizers are not responsible for injuries during activities.",
    terms: STANDARD_TERMS,
    avgRating: 4.6,
    reviews: [
      { id: 1, userName: "Ruhul Amin", rating: 5, date: "2026-02-25", comment: "The night trek was the most thrilling thing I have ever done. Absolutely loved it!" },
      { id: 2, userName: "Polash Mia", rating: 4, date: "2026-02-10", comment: "Great adventure camp. Rappelling was scary but so satisfying. Well-managed." },
    ],
  },

  {
    id: 10,
    title: "Sundarbans Night Safari",
    location: "Sundarbans",
    sublocation: "Khulna",
    description:
      "Night boat safari through the world's largest mangrove forest — spot Bengal tigers, saltwater crocodiles, and thousands of fireflies lighting up the night sky. One of the most unique male adventure experiences in Bangladesh.",
    price: 16000,
    priceForForeignGuests: 22000,
    dateFrom: "20 Sep",
    dateTo: "23 Sep",
    time: "17:00",
    spotsLeft: 6,
    days: 3,
    nights: 2,
    rating: 4.9,
    reviewCount: 62,
    image: "/assets/images/tour/style1/pic4.jpg",
    images: ["/assets/images/tour/style1/pic4.jpg", "/assets/images/tour/style1/pic6.jpg"],
    community: "Male",
    division: "Khulna",
    itinerary: [
      { day: 1, title: "Khulna Departure & First Night Watch", description: "Board vessel in Khulna at sunset. Cruise into the Sundarbans. First night wildlife watch from the boat deck." },
      { day: 2, title: "Forest Safari & Firefly Night", description: "Morning forest trek with armed rangers. Spot tigers, deer, and crocodiles. Evening firefly spotting excursion on the water." },
      { day: 3, title: "Bird Watch & Return", description: "Dawn bird watching on the river banks. Breakfast on the boat. Return to Khulna by noon. Departure." },
    ],
    inclusions: [
      "2 nights accommodation on the vessel",
      "All onboard meals",
      "Night and day guided safari",
      "Armed forest ranger escort",
      "All boat transfers inside the Sundarbans",
      "Sundarbans entry permits",
      "Firefly spotting excursion",
      "Experienced wildlife guide",
    ],
    exclusions: [
      "Transport to/from Khulna",
      "Personal spending",
      "Travel insurance",
      "Tips for guides and crew",
    ],
    disclaimer:
      "Tiger sightings are not guaranteed and depend entirely on natural conditions. Ranger instructions must be followed at all times. Tour may be modified due to forest department rules or weather.",
    terms: STANDARD_TERMS,
    avgRating: 4.9,
    reviews: [
      { id: 1, userName: "Ziaur Rahman",   rating: 5, date: "2026-03-02", comment: "We spotted a Bengal tiger! Shaking with excitement the whole time. Best trip ever." },
      { id: 2, userName: "Kamrul Hassan",  rating: 5, date: "2026-02-18", comment: "The firefly show was other-worldly. Sleeping on the boat in the Sundarbans — unforgettable." },
      { id: 3, userName: "Sazzad Hossain", rating: 4, date: "2026-01-22", comment: "Saw crocodiles, deer, and hundreds of birds. Highly recommended for adventure lovers." },
    ],
  },

  {
    id: 11,
    title: "Ratargul Swamp Expedition",
    location: "Ratargul",
    sublocation: "Sylhet",
    description:
      "Paddle through Bangladesh's only freshwater swamp forest — a hidden Amazon in Sylhet. Crystal-clear channels, submerged trees, and exotic birds make this a bucket-list adventure for outdoor enthusiasts.",
    price: 5500,
    priceForForeignGuests: 7500,
    dateFrom: "10 Oct",
    dateTo: "12 Oct",
    time: "07:00",
    spotsLeft: 18,
    days: 2,
    nights: 1,
    rating: 4.7,
    reviewCount: 134,
    image: "/assets/images/tour/style1/pic3.jpg",
    images: ["/assets/images/tour/style1/pic3.jpg", "/assets/images/tour/style1/pic1.jpg"],
    community: "Male",
    division: "Sylhet",
    itinerary: [
      { day: 1, title: "Arrival & Ratargul Boat Tour", description: "Arrive in Sylhet. Head straight to Ratargul for an afternoon boat tour through the swamp forest. Evening walk in Sylhet city." },
      { day: 2, title: "Tea Garden & Departure", description: "Morning visit to Sreemangal tea garden. Tea tasting session. Return and departure after lunch." },
    ],
    inclusions: [
      "1 night hotel in Sylhet",
      "Daily breakfast",
      "Ratargul swamp boat tour",
      "Tea garden and tea tasting visit",
      "Local guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Sylhet",
    ],
    disclaimer:
      "Boat access may be limited during the dry season. Bring insect repellent and breathable clothing. Follow all guide safety instructions on the water.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Sumon Hossain", rating: 5, date: "2026-02-25", comment: "Ratargul feels like the Amazon. Absolutely stunning. The boat ride through the trees was magical." },
      { id: 2, userName: "Jahir Uddin",   rating: 4, date: "2026-02-10", comment: "Beautiful and peaceful destination. Tea garden was a great bonus." },
    ],
  },

  {
    id: 12,
    title: "Cox's Bazar Surf & Beach Camp",
    location: "Cox's Bazar",
    sublocation: "Chittagong",
    description:
      "A 3-day beach camp for men at the world's longest sea beach. Learn to surf, explore Inani Beach, snorkel the coral zones, and enjoy beach volleyball — the ultimate beach adventure for groups of friends.",
    price: 10500,
    priceForForeignGuests: 14500,
    dateFrom: "5 Nov",
    dateTo: "8 Nov",
    time: "08:00",
    spotsLeft: 14,
    days: 3,
    nights: 2,
    rating: 4.5,
    reviewCount: 79,
    image: "/assets/images/tour/style1/pic2.jpg",
    images: ["/assets/images/tour/style1/pic2.jpg", "/assets/images/tour/style1/pic6.jpg"],
    community: "Male",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Surf Orientation", description: "Check in to beach camp. Afternoon surf lesson with a certified instructor. Evening bonfire and barbecue dinner." },
      { day: 2, title: "Inani Beach & Snorkelling", description: "Morning trip to Inani Beach for snorkelling. Afternoon beach volleyball tournament. Evening seafood dinner." },
      { day: 3, title: "Sunrise Surf & Departure", description: "Dawn surf session on the main beach. Breakfast and checkout. Souvenir shopping before departure." },
    ],
    inclusions: [
      "2 nights beach camp accommodation",
      "Daily breakfast and BBQ dinner",
      "Surf lessons with certified instructor",
      "Snorkelling equipment",
      "Beach volleyball",
      "Inani Beach transport",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Cox's Bazar",
    ],
    disclaimer:
      "Surfing and snorkelling involve physical risk. Participants must be comfortable in water. Life vests are provided. The organizers are not responsible for water-related injuries.",
    terms: STANDARD_TERMS,
    avgRating: 4.5,
    reviews: [
      { id: 1, userName: "Tonmoy Roy",   rating: 5, date: "2026-02-15", comment: "Best trip with the boys! Surfing was incredible and the bonfire night was epic." },
      { id: 2, userName: "Arafat Islam", rating: 4, date: "2026-01-20", comment: "Great activities. Inani Beach snorkelling was the highlight. Well-organized camp." },
    ],
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║                  FEMALE  (id: 13–18)                    ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 13,
    title: "Sylhet Tea Garden Retreat",
    location: "Sylhet",
    sublocation: "Sreemangal",
    description:
      "A peaceful women-only retreat through the scenic tea gardens of Sreemangal. Walk through endless rows of lush green tea bushes, visit a traditional tea factory, and relax at a cozy eco-resort surrounded by nature.",
    price: 9000,
    priceForForeignGuests: 12000,
    dateFrom: "12 May",
    dateTo: "16 May",
    time: "09:00",
    spotsLeft: 10,
    days: 4,
    nights: 3,
    rating: 4.8,
    reviewCount: 128,
    image: "/assets/images/tour/style1/pic1.jpg",
    images: ["/assets/images/tour/style1/pic1.jpg", "/assets/images/tour/style1/pic3.jpg"],
    community: "Female",
    division: "Sylhet",
    itinerary: [
      { day: 1, title: "Arrival & Evening Garden Walk", description: "Arrive in Sreemangal. Check in to eco-resort. Evening guided walk through the tea garden at golden hour. Welcome dinner with group." },
      { day: 2, title: "Tea Factory Tour & Lawachara", description: "Morning tea factory tour from leaf to cup. Afternoon guided walk in Lawachara National Park. Evening yoga session at the resort." },
      { day: 3, title: "Madhabbpur Lake & Village Tour", description: "Visit stunning Madhabbpur Lake with its water lily carpet. Afternoon tour of a local indigenous village and traditional crafts." },
      { day: 4, title: "Morning Meditation & Departure", description: "Morning meditation session in the tea garden. Checkout after breakfast. Departure with a Sreemangal tea souvenir pack." },
    ],
    inclusions: [
      "3 nights eco-resort accommodation",
      "All breakfasts and welcome dinner",
      "Tea factory guided tour",
      "Lawachara National Park guided walk",
      "Madhabbpur Lake visit",
      "Morning yoga and meditation sessions",
      "Local female tour guide",
      "Sreemangal tea souvenir pack",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and other dinners",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Sreemangal",
    ],
    disclaimer:
      "This is a female-only retreat. Participants are expected to maintain respectful behavior throughout. Itinerary may be adjusted based on weather or local conditions.",
    terms: STANDARD_TERMS,
    avgRating: 4.8,
    reviews: [
      { id: 1, userName: "Tasnim Sultana",    rating: 5, date: "2026-02-28", comment: "Waking up in the middle of a tea garden is something I will treasure forever." },
      { id: 2, userName: "Nafisa Akter",      rating: 5, date: "2026-02-12", comment: "Wonderfully organized. The female guide was warm and knowledgeable." },
      { id: 3, userName: "Mithila Chowdhury", rating: 4, date: "2026-01-20", comment: "Beautiful retreat. Madhabbpur Lake was absolutely gorgeous." },
    ],
  },

  {
    id: 14,
    title: "Sajek Valley Women's Escape",
    location: "Sajek",
    sublocation: "Rangamati",
    description:
      "A safe and curated cloud-top escape for women in the magical Sajek Valley. Watch clouds drift through the hills, experience tribal culture, and enjoy a peaceful hillside retreat designed exclusively for women.",
    price: 6500,
    priceForForeignGuests: 9000,
    dateFrom: "5 Jul",
    dateTo: "7 Jul",
    time: "06:30",
    spotsLeft: 12,
    days: 2,
    nights: 1,
    rating: 4.8,
    reviewCount: 152,
    image: "/assets/images/tour/style1/pic5.jpg",
    images: ["/assets/images/tour/style1/pic5.jpg", "/assets/images/tour/style1/pic1.jpg"],
    community: "Female",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Sunset at Ruilui Para", description: "Arrive at Sajek. Check in to resort. Head to Ruilui Para viewpoint for a stunning cloud-covered sunset. Evening bonfire and cultural programme." },
      { day: 2, title: "Sunrise at Konglak Para & Departure", description: "Pre-dawn hike to Konglak Para for a magical sunrise. Tribal village visit after breakfast. Departure after lunch." },
    ],
    inclusions: [
      "1 night resort accommodation",
      "Daily breakfast",
      "Guided viewpoint tours (Ruilui Para & Konglak Para)",
      "Evening bonfire and cultural programme",
      "Tribal village visit",
      "Female tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Sajek",
    ],
    disclaimer:
      "Female-only event. Cloud views are weather-dependent. Bring warm clothing for the early morning. Hill roads can be rough.",
    terms: STANDARD_TERMS,
    avgRating: 4.8,
    reviews: [
      { id: 1, userName: "Nusrat Jahan",   rating: 5, date: "2026-02-20", comment: "Standing above the clouds with my girlfriends was the most magical experience!" },
      { id: 2, userName: "Sumaiya Rahman", rating: 5, date: "2026-02-05", comment: "The guide made us feel completely safe. A perfect women's retreat." },
    ],
  },

  {
    id: 15,
    title: "Kuakata Women's Wellness Retreat",
    location: "Kuakata",
    sublocation: "Barishal",
    description:
      "A relaxing coastal retreat for women — beach yoga, sunrise walks, fresh seafood, and sunset meditation on one of Bangladesh's most beautiful beaches. Kuakata is the perfect place to recharge and reconnect.",
    price: 8500,
    priceForForeignGuests: 11500,
    dateFrom: "15 Jul",
    dateTo: "18 Jul",
    time: "09:30",
    spotsLeft: 15,
    days: 3,
    nights: 2,
    rating: 4.6,
    reviewCount: 302,
    image: "/assets/images/tour/style1/pic6.jpg",
    images: ["/assets/images/tour/style1/pic6.jpg", "/assets/images/tour/style1/pic2.jpg"],
    community: "Female",
    division: "Barishal",
    itinerary: [
      { day: 1, title: "Arrival & Sunset Meditation", description: "Arrive in Kuakata. Check in and head to the beach for sunset meditation. Welcome seafood dinner with the group." },
      { day: 2, title: "Sunrise Yoga & Mangrove Tour", description: "Dawn yoga session on the beach. Boat tour to the mangrove forest. Visit the Rakhaine tribal village and Buddhist temple." },
      { day: 3, title: "Gangamati Forest Walk & Departure", description: "Morning nature walk in Gangamati Reserved Forest. Checkout and departure after a light lunch." },
    ],
    inclusions: [
      "2 nights accommodation",
      "Daily breakfast",
      "Sunrise yoga sessions on the beach",
      "Mangrove forest boat tour",
      "Rakhaine village and temple visit",
      "Gangamati forest guided walk",
      "Female tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner (except noted)",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Kuakata",
    ],
    disclaimer:
      "Female-only event. Coastal weather may affect the itinerary. Bring sunscreen and comfortable walking shoes.",
    terms: STANDARD_TERMS,
    avgRating: 4.6,
    reviews: [
      { id: 1, userName: "Shirin Begum",  rating: 5, date: "2026-02-20", comment: "The sunrise yoga on the beach was transformative. Exactly what I needed." },
      { id: 2, userName: "Dilruba Akter", rating: 4, date: "2026-02-05", comment: "Wonderful retreat. The mangrove tour was beautiful and the guide was excellent." },
      { id: 3, userName: "Sadia Islam",   rating: 5, date: "2026-01-10", comment: "Kuakata at sunrise and sunset — I have never felt so at peace. Highly recommended!" },
    ],
  },

  {
    id: 16,
    title: "Ratargul Women's Swamp Tour",
    location: "Ratargul",
    sublocation: "Sylhet",
    description:
      "A guided, women-only boat tour through Ratargul Swamp Forest — Bangladesh's hidden Amazon. Glide through crystal-clear channels beneath submerged trees in a safe, expertly guided experience.",
    price: 5500,
    priceForForeignGuests: 7500,
    dateFrom: "10 Aug",
    dateTo: "12 Aug",
    time: "07:00",
    spotsLeft: 20,
    days: 2,
    nights: 1,
    rating: 4.7,
    reviewCount: 145,
    image: "/assets/images/tour/style1/pic3.jpg",
    images: ["/assets/images/tour/style1/pic3.jpg", "/assets/images/tour/style1/pic1.jpg"],
    community: "Female",
    division: "Sylhet",
    itinerary: [
      { day: 1, title: "Arrival & Ratargul Boat Ride", description: "Arrive in Sylhet. Head to Ratargul for an afternoon boat tour through the swamp forest. Evening market walk in Sylhet city." },
      { day: 2, title: "Tea Garden & Departure", description: "Morning visit to Sreemangal tea garden. Tea tasting and factory tour. Return and departure after lunch." },
    ],
    inclusions: [
      "1 night hotel in Sylhet",
      "Daily breakfast",
      "Ratargul swamp boat tour",
      "Tea garden and factory visit",
      "Female tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Sylhet",
    ],
    disclaimer:
      "Female-only tour. Boat access may be limited in dry season. Bring insect repellent and light, breathable clothing.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Sumaiya Rahman", rating: 5, date: "2026-02-25", comment: "The swamp forest is like nothing I have ever seen. Magical and so peaceful." },
      { id: 2, userName: "Arifa Khatun",   rating: 4, date: "2026-02-10", comment: "Beautiful tour. The female guide was excellent and made us all feel very safe." },
    ],
  },

  {
    id: 17,
    title: "Cox's Bazar Women's Beach Retreat",
    location: "Cox's Bazar",
    sublocation: "Chittagong",
    description:
      "A women-only beach holiday with private accommodation, guided excursions, sunrise yoga, and safe swimming at the world's longest sea beach. A perfect mix of relaxation and coastal exploration.",
    price: 13000,
    priceForForeignGuests: 17500,
    dateFrom: "5 Sep",
    dateTo: "9 Sep",
    time: "08:30",
    spotsLeft: 8,
    days: 4,
    nights: 3,
    rating: 4.9,
    reviewCount: 190,
    image: "/assets/images/tour/style1/pic2.jpg",
    images: ["/assets/images/tour/style1/pic2.jpg", "/assets/images/tour/style1/pic4.jpg"],
    community: "Female",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Sunset on the Beach", description: "Check in to women-only accommodation. Evening sunset walk on the main beach. Welcome dinner with the group." },
      { day: 2, title: "Sunrise Yoga & Himchari", description: "Dawn yoga session on the beach. Morning trip to Himchari National Park and waterfall." },
      { day: 3, title: "Maheshkhali Island Excursion", description: "Boat trip to Maheshkhali Island. Visit Adinath Temple and explore the island market." },
      { day: 4, title: "Inani Beach & Departure", description: "Morning visit to Inani Beach with unique coral stones. Souvenir shopping. Departure after lunch." },
    ],
    inclusions: [
      "3 nights women-only accommodation",
      "Daily breakfast and welcome dinner",
      "Sunrise yoga sessions",
      "Himchari National Park guided visit",
      "Maheshkhali Island boat tour",
      "Inani Beach visit",
      "Female tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and other dinners",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Cox's Bazar",
    ],
    disclaimer:
      "Female-only retreat. Beach safety guidelines must be followed. Sunrise yoga participation is optional.",
    terms: STANDARD_TERMS,
    avgRating: 4.9,
    reviews: [
      { id: 1, userName: "Layla Hasan",   rating: 5, date: "2026-03-01", comment: "The safest and most enjoyable beach trip I have ever been on. Loved every moment!" },
      { id: 2, userName: "Runa Akter",    rating: 5, date: "2026-02-14", comment: "Maheshkhali Island was absolutely beautiful. The guide was wonderful throughout." },
      { id: 3, userName: "Fariha Khanam", rating: 4, date: "2026-01-28", comment: "Great organization. Yoga on the beach at sunrise was a perfect start to each day." },
    ],
  },

  {
    id: 18,
    title: "Rangamati Lake Wellness Tour",
    location: "Rangamati",
    sublocation: "Chittagong Hill Tracts",
    description:
      "A rejuvenating women-only lake tour in the serene Kaptai Lake area. Cruise the shimmering waters, visit Chakma tribal artisan villages, and find peace in the rolling hills of Rangamati.",
    price: 9500,
    priceForForeignGuests: 13000,
    dateFrom: "20 Oct",
    dateTo: "23 Oct",
    time: "09:00",
    spotsLeft: 12,
    days: 3,
    nights: 2,
    rating: 4.7,
    reviewCount: 98,
    image: "/assets/images/tour/style1/pic5.jpg",
    images: ["/assets/images/tour/style1/pic5.jpg", "/assets/images/tour/style1/pic6.jpg"],
    community: "Female",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Sunset Lake Cruise", description: "Arrive in Rangamati. Evening sunset cruise on Kaptai Lake. Welcome dinner at a lakeside restaurant." },
      { day: 2, title: "Chakma Artisan Village & Hanging Bridge", description: "Morning visit to a Chakma tribal weaving village. Cross the hanging bridge. Afternoon meditation by the lake." },
      { day: 3, title: "Shuvolong Waterfall & Departure", description: "Boat trip to Shuvolong Waterfall. Return for checkout and departure after lunch." },
    ],
    inclusions: [
      "2 nights lake-view accommodation",
      "Daily breakfast and welcome dinner",
      "Kaptai Lake sunset cruise",
      "Chakma tribal artisan village visit",
      "Hanging bridge visit",
      "Shuvolong Waterfall boat trip",
      "Female tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Other lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Rangamati",
    ],
    disclaimer:
      "Female-only tour. Life jackets must be worn during all boat rides. Waterfall visit depends on water levels.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Ferdousi Begum", rating: 5, date: "2026-02-22", comment: "The most peaceful trip I have ever taken. The lake views were stunning." },
      { id: 2, userName: "Meher Nigar",    rating: 4, date: "2026-02-08", comment: "Beautiful destination. The Chakma weaving village was a highlight — bought lovely handmade scarves!" },
    ],
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║                 COMBINED  (id: 19–24)                   ║
  // ╚══════════════════════════════════════════════════════════╝

  {
    id: 19,
    title: "Cox's Bazar Beach Escape",
    location: "Cox's Bazar",
    sublocation: "Chittagong",
    description:
      "Discover the world's longest natural sea beach on this open mixed-group tour. Sunsets over the ocean, Maheshkhali Island, Himchari National Park, and fresh seafood — Cox's Bazar has something for everyone.",
    price: 12500,
    priceForForeignGuests: 16500,
    dateFrom: "20 May",
    dateTo: "24 May",
    time: "08:30",
    spotsLeft: 5,
    days: 4,
    nights: 3,
    rating: 4.9,
    reviewCount: 214,
    image: "/assets/images/tour/style1/pic2.jpg",
    images: ["/assets/images/tour/style1/pic2.jpg", "/assets/images/tour/style1/pic4.jpg"],
    community: "Combined",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Beach Orientation", description: "Check in to hotel. Evening orientation walk on Cox's Bazar main beach. Welcome dinner for the group." },
      { day: 2, title: "Himchari National Park", description: "Guided nature walk through Himchari National Park. Visit the waterfall and enjoy the forest environment." },
      { day: 3, title: "Maheshkhali Island Tour", description: "Boat trip to Maheshkhali Island. Visit Adinath Temple and salt fields. Beachside seafood dinner." },
      { day: 4, title: "Inani Beach & Departure", description: "Morning at Inani Beach with its unique coral stones. Souvenir shopping. Departure after lunch." },
    ],
    inclusions: [
      "3 nights standard hotel accommodation",
      "Daily breakfast",
      "All sightseeing transportation",
      "Himchari National Park guided visit",
      "Maheshkhali Island boat tour",
      "Inani Beach visit",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner (except noted)",
      "Personal spending",
      "Entry tickets",
      "Travel insurance",
      "Transport to/from Cox's Bazar",
    ],
    disclaimer:
      "Itinerary may change due to weather or sea conditions. The organizers are not responsible for personal loss or injury during the trip.",
    terms: STANDARD_TERMS,
    avgRating: 4.9,
    reviews: [
      { id: 1, userName: "Rakib Hossain", rating: 5, date: "2026-02-10", comment: "Perfect trip for a mixed group! The beach was stunning and everyone had an amazing time." },
      { id: 2, userName: "Fatema Begum",  rating: 5, date: "2026-01-28", comment: "Everything went smoothly. Highly recommended for any group of friends." },
      { id: 3, userName: "Tanvir Ahmed",  rating: 4, date: "2026-01-15", comment: "Great experience overall. The Maheshkhali boat tour was the definite highlight." },
    ],
  },

  {
    id: 20,
    title: "Kuakata Sunrise Retreat",
    location: "Kuakata",
    sublocation: "Barishal",
    description:
      "One of the few places in Bangladesh where you can see both sunrise and sunset from the same beach. This combined-group retreat takes you through coastal villages, mangrove forest, and the unique Rakhaine community.",
    price: 8500,
    priceForForeignGuests: 11500,
    dateFrom: "15 Jul",
    dateTo: "18 Jul",
    time: "09:30",
    spotsLeft: 15,
    days: 3,
    nights: 2,
    rating: 4.6,
    reviewCount: 302,
    image: "/assets/images/tour/style1/pic6.jpg",
    images: ["/assets/images/tour/style1/pic6.jpg", "/assets/images/tour/style1/pic2.jpg"],
    community: "Combined",
    division: "Barishal",
    itinerary: [
      { day: 1, title: "Arrival & Sunset at Beach", description: "Arrive in Kuakata and check in. Evening sunset on the beach. Seafood dinner at a local restaurant." },
      { day: 2, title: "Sunrise, Mangroves & Rakhaine Village", description: "Early sunrise on the beach. Boat tour to mangrove forest. Visit Rakhaine tribal village and Buddhist temple." },
      { day: 3, title: "Gangamati Forest & Departure", description: "Morning walk in Gangamati Reserved Forest. Checkout and departure after lunch." },
    ],
    inclusions: [
      "2 nights accommodation",
      "Daily breakfast",
      "Mangrove forest boat tour",
      "Rakhaine village and temple visit",
      "Gangamati forest guided walk",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Kuakata",
    ],
    disclaimer:
      "Coastal weather can be unpredictable. Sunrise and sunset visibility depend on weather. Itinerary may be adjusted for safety.",
    terms: STANDARD_TERMS,
    avgRating: 4.6,
    reviews: [
      { id: 1, userName: "Mahbub Alam", rating: 5, date: "2026-02-20", comment: "Sunrise and sunset from the same beach — truly a once-in-a-lifetime experience!" },
      { id: 2, userName: "Riya Akter",  rating: 4, date: "2026-02-05", comment: "Great trip. The mangrove boat tour was the highlight. Well organized for a mixed group." },
      { id: 3, userName: "Karim Uddin", rating: 5, date: "2026-01-10", comment: "Loved every moment. Perfectly organized. Would come again!" },
    ],
  },

  {
    id: 21,
    title: "Ratargul Swamp Forest Tour",
    location: "Ratargul",
    sublocation: "Sylhet",
    description:
      "Explore Bangladesh's only freshwater swamp forest by boat — a hidden gem that feels like the Amazon of Bangladesh. Open to all genders, this guided tour is peaceful, scenic, and unforgettable.",
    price: 5500,
    priceForForeignGuests: 7500,
    dateFrom: "10 Aug",
    dateTo: "12 Aug",
    time: "07:00",
    spotsLeft: 20,
    days: 2,
    nights: 1,
    rating: 4.7,
    reviewCount: 145,
    image: "/assets/images/tour/style1/pic3.jpg",
    images: ["/assets/images/tour/style1/pic3.jpg", "/assets/images/tour/style1/pic1.jpg"],
    community: "Combined",
    division: "Sylhet",
    itinerary: [
      { day: 1, title: "Arrival & Ratargul Boat Tour", description: "Arrive in Sylhet and head to Ratargul for an afternoon boat tour through the swamp forest. Evening walk in Sylhet city." },
      { day: 2, title: "Tea Garden Visit & Departure", description: "Morning Sreemangal tea garden visit with tasting. Return to Sylhet and departure after lunch." },
    ],
    inclusions: [
      "1 night hotel in Sylhet",
      "Daily breakfast",
      "Ratargul swamp boat tour",
      "Tea garden visit and tasting",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Sylhet",
    ],
    disclaimer:
      "Boat access may be limited in the dry season. Bring insect repellent and breathable clothing. Follow all guide safety instructions.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Sumaiya Rahman", rating: 5, date: "2026-02-25", comment: "Absolutely magical. The boat through the submerged trees was an incredible experience." },
      { id: 2, userName: "Arif Chowdhury", rating: 4, date: "2026-02-10", comment: "Beautiful and peaceful. The tea garden visit was a great bonus." },
    ],
  },

  {
    id: 22,
    title: "Maheshkhali Island Day Tour",
    location: "Maheshkhali",
    sublocation: "Cox's Bazar",
    description:
      "Visit the only hilly island in Bangladesh — home to ancient temples, salt fields, and unique birdlife. Open to all, this fascinating boat trip from Cox's Bazar is a must for curious explorers.",
    price: 7000,
    priceForForeignGuests: 9500,
    dateFrom: "5 Sep",
    dateTo: "7 Sep",
    time: "09:00",
    spotsLeft: 18,
    days: 2,
    nights: 1,
    rating: 4.5,
    reviewCount: 89,
    image: "/assets/images/tour/style1/pic4.jpg",
    images: ["/assets/images/tour/style1/pic4.jpg", "/assets/images/tour/style1/pic2.jpg"],
    community: "Combined",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Cox's Bazar Arrival & Boat to Maheshkhali", description: "Arrive in Cox's Bazar. Afternoon boat to Maheshkhali Island. Visit Adinath Temple and salt fields. Sunset at the island beach." },
      { day: 2, title: "Island Morning & Return", description: "Morning bird watching near the mangrove edges of the island. Return boat to Cox's Bazar. Departure after lunch." },
    ],
    inclusions: [
      "1 night island guesthouse accommodation",
      "Daily breakfast",
      "Boat transfer to/from Maheshkhali",
      "Adinath Temple guided visit",
      "Salt fields tour",
      "Local tour guide",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Cox's Bazar",
    ],
    disclaimer:
      "Boat trips depend on sea and tidal conditions. The itinerary may change based on tides. Travelers are responsible for their own safety during island exploration.",
    terms: STANDARD_TERMS,
    avgRating: 4.5,
    reviews: [
      { id: 1, userName: "Imran Khan",    rating: 5, date: "2026-02-18", comment: "Maheshkhali was a revelation. The Adinath Temple is stunning and the salt fields were unlike anything I have seen." },
      { id: 2, userName: "Parvin Akhter", rating: 4, date: "2026-01-30", comment: "Unique and interesting destination. The boat ride was adventurous and the guide was knowledgeable." },
    ],
  },

  {
    id: 23,
    title: "Rangamati Lake Explorer",
    location: "Rangamati",
    sublocation: "Chittagong Hill Tracts",
    description:
      "Cruise the shimmering Kaptai Lake surrounded by rolling hills, visit tribal villages, and cross the famous hanging bridge. A combined-group lake experience suitable for all travelers.",
    price: 11000,
    priceForForeignGuests: 15000,
    dateFrom: "20 Oct",
    dateTo: "23 Oct",
    time: "09:00",
    spotsLeft: 16,
    days: 3,
    nights: 2,
    rating: 4.6,
    reviewCount: 117,
    image: "/assets/images/tour/style1/pic5.jpg",
    images: ["/assets/images/tour/style1/pic5.jpg", "/assets/images/tour/style1/pic3.jpg"],
    community: "Combined",
    division: "Chittagong",
    itinerary: [
      { day: 1, title: "Arrival & Kaptai Lake Sunset Cruise", description: "Arrive in Rangamati and check in. Evening sunset cruise on Kaptai Lake. Dinner at lakeside restaurant." },
      { day: 2, title: "Tribal Village & Hanging Bridge", description: "Morning visit to a Chakma tribal village. Cross the iconic hanging bridge. Afternoon lake-side relaxation." },
      { day: 3, title: "Shuvolong Waterfall & Departure", description: "Boat trip to Shuvolong Waterfall. Checkout and departure after lunch." },
    ],
    inclusions: [
      "2 nights lake-view accommodation",
      "Daily breakfast",
      "Kaptai Lake sunset cruise",
      "Tribal village guided visit",
      "Hanging bridge visit",
      "Shuvolong Waterfall boat trip",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Lunch and dinner",
      "Personal expenses",
      "Travel insurance",
      "Transport to/from Rangamati",
    ],
    disclaimer:
      "Life jackets must be worn during all boat rides. Waterfall visit depends on water levels.",
    terms: STANDARD_TERMS,
    avgRating: 4.6,
    reviews: [
      { id: 1, userName: "Shirin Akter",      rating: 5, date: "2026-02-15", comment: "The lake cruise was breathtaking. A perfect trip for any mixed group." },
      { id: 2, userName: "Babul Hossain",     rating: 4, date: "2026-01-30", comment: "Great destination. Shuvolong Waterfall was magnificent. Very friendly guides." },
      { id: 3, userName: "Jannatul Ferdous",  rating: 5, date: "2026-01-10", comment: "Loved the tribal village visit and the hanging bridge was thrilling. Highly recommended!" },
    ],
  },

  {
    id: 24,
    title: "Sylhet Tea & Forest Tour",
    location: "Sylhet",
    sublocation: "Sreemangal",
    description:
      "A combined-group tour through the green tea gardens, wildlife-rich forests, and serene lakes of Sreemangal. Perfect for mixed groups who enjoy nature, culture, and relaxed travel.",
    price: 9000,
    priceForForeignGuests: 12000,
    dateFrom: "5 Nov",
    dateTo: "9 Nov",
    time: "09:00",
    spotsLeft: 18,
    days: 4,
    nights: 3,
    rating: 4.7,
    reviewCount: 167,
    image: "/assets/images/tour/style1/pic1.jpg",
    images: ["/assets/images/tour/style1/pic1.jpg", "/assets/images/tour/style1/pic5.jpg"],
    community: "Combined",
    division: "Sylhet",
    itinerary: [
      { day: 1, title: "Arrival & Tea Garden Walk", description: "Check in to resort. Evening guided walk through Finlay Tea Estate. Welcome dinner for the group." },
      { day: 2, title: "Lawachara National Park", description: "Guided walk through Lawachara National Park. Wildlife spotting and tropical forest exploration." },
      { day: 3, title: "Madhabbpur Lake & Tea Factory", description: "Visit the water lily lake. Afternoon tea factory tour from leaf to cup." },
      { day: 4, title: "Baiker Haor Bird Watching & Departure", description: "Morning bird watching at Baiker Haor wetland. Collect tea souvenir pack. Departure after breakfast." },
    ],
    inclusions: [
      "3 nights resort accommodation",
      "Daily breakfast and welcome dinner",
      "Tea garden guided walk",
      "Lawachara National Park guided tour",
      "Madhabbpur Lake visit",
      "Tea factory guided tour",
      "Sreemangal tea souvenir pack",
      "Local tour guide",
      "All internal transfers",
    ],
    exclusions: [
      "Other meals",
      "Personal spending",
      "Travel insurance",
      "Transport to/from Sreemangal",
    ],
    disclaimer:
      "Itinerary may change due to weather. Participants must follow guide instructions inside national parks.",
    terms: STANDARD_TERMS,
    avgRating: 4.7,
    reviews: [
      { id: 1, userName: "Nasrin Begum",       rating: 5, date: "2026-02-28", comment: "What a gorgeous destination. The tea gardens are stunning and Lawachara was magical." },
      { id: 2, userName: "Jahangir Alam",      rating: 4, date: "2026-02-14", comment: "Great mixed group trip. Everyone enjoyed the forest walk and the lake was beautiful." },
      { id: 3, userName: "Tahmina Chowdhury",  rating: 5, date: "2026-01-20", comment: "Perfect 4-day escape. The tea souvenir pack was a lovely touch. Highly recommend!" },
    ],
  },
];

// TODO: Replace with real API → GET /api/events and GET /api/events/:id

// ── Get a single event by id (used by EventDetail page) ─────────
export const getEventById = async (id) => {
  try {
    return await getTourById(id);
  } catch (error) {
    console.warn('Failed to fetch tour from API, using local fallback', error);
    return MOCK_EVENTS_DETAIL.find((e) => e.id === Number(id)) || null;
  }
};

// ── Get all events for a community page ─────────────────────────
// Usage: const events = await getEventsByCommunity("Male");
const normalizeTour = (tour) => {
  const dates = (tour.dateFrom || tour.dates || "").toString();
  const [rawFrom, rawTo] = dates.split("-").map((text) => text?.trim() || "");

  let from = rawFrom;
  let to = rawTo;
  if (rawFrom && rawTo && !/[A-Za-z]/.test(rawFrom) && /[A-Za-z]/.test(rawTo)) {
    const monthPart = rawTo.replace(/^[0-9]+\s*/, "");
    from = `${rawFrom} ${monthPart}`.trim();
  }

  return {
    ...tour,
    location: tour.location || tour.destination || "",
    sublocation: tour.sublocation || "",
    price: tour.price ?? 0,
    dateFrom: tour.dateFrom || from,
    dateTo: tour.dateTo || to,
    spotsLeft: tour.spotsLeft ?? tour.capacity ?? 0,
    rating: tour.rating ?? tour.avgRating ?? 5.0,
    image: tour.image || tour.images?.[0] || "",
    division: tour.division || tour.destination || "",
  };
};

export const getEventsByCommunity = async (community) => {
  const normalizedCommunity = community?.toString().trim().toLowerCase();

  try {
    const tours = await getTours();
    const normalizedTours = tours.map(normalizeTour);

    const filtered = normalizedTours.filter(
      (e) => e.community?.toString().trim().toLowerCase() === normalizedCommunity,
    );

    if (filtered.length > 0) return filtered;
  } catch (error) {
    console.warn('Failed to fetch tours from backend, using local fallback.', error);
  }

  return MOCK_EVENTS_DETAIL.filter(
    (e) => e.community?.toString().trim().toLowerCase() === normalizedCommunity,
  ).map(normalizeTour);
};