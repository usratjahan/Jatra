import React, { useState } from 'react';
import { getContactInfo, updateContactInfo } from '../../../services/adminService';

const Field = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-[#e8f5f3] focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-300 transition-colors"
    />
  </div>
);

const ContactInformation = () => {
  const [form, setForm]     = useState(getContactInfo());
  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await updateContactInfo(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-800 mb-6">Contact Information</h2>
      <p className="text-xs text-gray-400 mb-5">
        Changes saved here will reflect on the public <strong>Contact Us</strong> page instantly.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone (Primary)"   value={form.phone}    onChange={set('phone')} />
          <Field label="Phone (Secondary)" value={form.phone2}   onChange={set('phone2')} />
          <Field label="Email (Primary)"   value={form.email}    onChange={set('email')} />
          <Field label="Email (Support)"   value={form.email2}   onChange={set('email2')} />
          <Field label="WhatsApp"          value={form.whatsapp} onChange={set('whatsapp')} />
          <Field label="Address"           value={form.address}  onChange={set('address')} />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Social Links</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Facebook"  value={form.facebook}  onChange={set('facebook')} />
            <Field label="Twitter"   value={form.twitter}   onChange={set('twitter')} />
            <Field label="Instagram" value={form.instagram} onChange={set('instagram')} />
            <Field label="LinkedIn"  value={form.linkedin}  onChange={set('linkedin')} />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <span className="text-green-600 text-sm font-semibold">✓ Saved successfully!</span>}
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;