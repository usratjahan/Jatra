import React from "react";

const ExclusionsTab = ({ exclusions = [] }) => (
  <ul className="space-y-3">
    {exclusions.map((item, idx) => (
      <li key={idx} className="flex items-start gap-3">
        {/* Red X */}
        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
            fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </span>
        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

export default ExclusionsTab;