import React from "react";

const DisclaimerTab = ({ disclaimer = "" }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
    <div className="flex items-start gap-3">
      {/* Warning icon */}
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="flex-shrink-0 mt-0.5">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <path d="M12 9v4"/><path d="M12 17h.01"/>
      </svg>
      <div>
        <h4 className="text-amber-800 font-bold text-sm mb-2">Please Read Before Booking</h4>
        <p className="text-amber-900 text-sm leading-relaxed">{disclaimer}</p>
      </div>
    </div>
  </div>
);

export default DisclaimerTab;