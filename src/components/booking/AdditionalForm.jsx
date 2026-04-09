import React from "react";
import { Field, Input } from "./TravelerForm";

const AdditionalTraveler = ({ traveler, index, onRemove, onUpdate }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
    {/* Card header */}
    <div className="bg-[#0F393E] px-5 py-3 flex items-center justify-between">
      <h3 className="text-white font-bold text-sm tracking-wide">
        Additional Traveler {index + 1}
      </h3>
      <button
        onClick={() => onRemove(traveler.id)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
        aria-label="Remove traveler"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div className="p-5 space-y-4">
      {/* Row 1: Full Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <Input
            value={traveler.fullName}
            onChange={onUpdate(traveler.id, "fullName")}
            placeholder="Full Name*"
          />
        </Field>
        <Field label="Email Address" required>
          <Input
            type="email"
            value={traveler.email}
            onChange={onUpdate(traveler.id, "email")}
            placeholder="Email Address*"
          />
        </Field>
      </div>

      {/* Row 2: Phone + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone Number" required>
          <Input
            type="tel"
            value={traveler.phone}
            onChange={onUpdate(traveler.id, "phone")}
            placeholder="Phone Number*"
          />
        </Field>
        <Field label="Address">
          <Input
            value={traveler.address}
            onChange={onUpdate(traveler.id, "address")}
            placeholder="Address*"
          />
        </Field>
      </div>

      {/* Row 3: NID + Birth Registration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="NID No. (if any)">
          <Input
            value={traveler.nidNo}
            onChange={onUpdate(traveler.id, "nidNo")}
            placeholder="NID No. (if any)"
          />
        </Field>
        <Field label="Birth Registration No.">
          <Input
            value={traveler.birthRegistrationNo}
            onChange={onUpdate(traveler.id, "birthRegistrationNo")}
            placeholder="Birth Registration No.*"
          />
        </Field>
      </div>
    </div>
  </div>
);

export default AdditionalTraveler;
