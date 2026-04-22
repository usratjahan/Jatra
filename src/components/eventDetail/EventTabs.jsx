const EVENT_TABS = [
  { key: "itinerary", label: "Itinerary" },
  { key: "inclusions", label: "Inclusions" },
  { key: "exclusions", label: "Exclusions" },
  { key: "disclaimer", label: "Disclaimer" },
  { key: "terms", label: "Terms & Conditions" },
  { key: "review", label: "Review" },
];

const EventTabs = ({ activeTab, onTabChange }) => (
  <div className="border-b border-gray-200 mb-6">
    <div className="flex gap-0 overflow-x-auto scrollbar-hide -mb-px">
      {EVENT_TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-shrink-0 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === tab.key
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

export default EventTabs;
