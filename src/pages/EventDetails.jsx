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
  

  return (
    <div className="min-h-screen bg-[#edfffd] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-teal-700 font-bold">Event Detail page — id: {id}</p>
      </div>
    </div>
  );
};

export default EventDetail;
