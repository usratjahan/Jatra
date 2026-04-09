// FILE: src/components/booking/TravelerForm.jsx

import React from 'react';

// ── Reusable field ───────────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', readOnly }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800 placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all
      ${readOnly
        ? 'bg-teal-50 border-teal-200 cursor-default'
        : 'bg-white border-gray-200 hover:border-teal-300'
      }`}
  />
);

// ── Primary Traveler Form ────────────────────────────────────────
const TravelerForm = ({ primary, updatePrimary }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">

    {/* Card header */}
    <div className="bg-[#0F393E] px-5 py-3">
      <h3 className="text-white font-bold text-sm tracking-wide">Primary Traveler</h3>
    </div>

    <div className="p-5 space-y-4">

      {/* Row 1: Full Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <Input
            value={primary.fullName}
            onChange={updatePrimary('fullName')}
            placeholder="Full Name*"
          />
        </Field>
        <Field label="Email Address" required>
          <Input
            type="email"
            value={primary.email}
            onChange={updatePrimary('email')}
            placeholder="user@gmail.com"
          />
        </Field>
      </div>

      {/* Row 2: Phone + Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone Number" required>
          <Input
            type="tel"
            value={primary.phone}
            onChange={updatePrimary('phone')}
            placeholder="01xxxxxxxxx"
          />
        </Field>
        <Field label="Address">
          <Input
            value={primary.address}
            onChange={updatePrimary('address')}
            placeholder="Mohammadpur, Dhaka-1207"
          />
        </Field>
      </div>

      {/* Row 3: NID + WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="NID No.">
          <Input
            value={primary.nidNo}
            onChange={updatePrimary('nidNo')}
            placeholder="NID No."
          />
        </Field>
        <Field label="WhatsApp No.">
          <Input
            type="tel"
            value={primary.whatsappNo}
            onChange={updatePrimary('whatsappNo')}
            placeholder="WhatsApp No."
          />
        </Field>
      </div>

      {/* Emergency Contact section */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
          Emergency Contact Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Emergency Contact">
            <Input
              value={primary.emergencyContact}
              onChange={updatePrimary('emergencyContact')}
              placeholder="Emergency Contact*"
            />
          </Field>
          <Field label="Relationship with Contact">
            <Input
              value={primary.emergencyRelationship}
              onChange={updatePrimary('emergencyRelationship')}
              placeholder="Relationship with contact*"
            />
          </Field>
        </div>
      </div>

    </div>
  </div>
);

export default TravelerForm;
export { Field, Input };