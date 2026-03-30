import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useEventDetail from "../hooks/useEventDetail";
import EventDetailHeader from "../components/eventDetail/EventDetailHeader";
import EventSidebarCard from "../components/eventDetail/EventSidebarCard";
import EventOverview from "../components/eventDetail/EventOverview";
import EventTabs from "../components/eventDetail/EventTabs";
import ItineraryTab from "../components/eventDetail/tabs/ItineraryTab";
import InclusionsTab from "../components/eventDetail/tabs/InclusionTab";
import ExclusionsTab from "../components/eventDetail/tabs/ExclusionTab";
import DisclaimerTab from "../components/eventDetail/tabs/Disclaimer";
import TermsTab from "../components/eventDetail/tabs/TermsTab";
import ReviewTab from "../components/eventDetail/tabs/ReviewTab";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, loading, error } = useEventDetail(id);
  const [activeTab, setActiveTab] = useState("itinerary");

   // ── Loading skeleton ──
  if (loading)
    return (
      <div className="min-h-screen bg-[#edfffd] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-80 bg-gray-200 rounded-2xl" />
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="h-64 w-full rounded-2xl bg-gray-200 flex-shrink-0 lg:w-72 xl:w-80" />
            </div>
          </div>
        </div>
      </div>
    );

    // ── Error / not found ──
  if (error || !event)
    return (
      <div className="min-h-screen bg-[#edfffd] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Event not found
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {error || "This event doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-full text-sm font-semibold hover:bg-teal-500 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#edfffd] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-teal-700 font-bold">Event Detail page — id: {id}</p>
      </div>
    </div>
  );
};

export default EventDetail;
