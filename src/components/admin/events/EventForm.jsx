// 6 tabs: Basic Info, Itinerary, Inclusions, Exclusions, Disclaimer, Terms & Conditions

import React, { useRef, useState } from 'react';
import { createEvent, updateEvent } from '../../../services/adminService';

const TABS = ['Basic', 'Itinerary', 'Inclusions', 'Exclusions', 'Disclaimer', 'Terms & Conditions'];
const COMMUNITIES = ['Family', 'Male', 'Female', 'Combined'];

const Input = ({ label, value, onChange, type = 'text', required, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#e8f5f3] focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-300 transition-colors" />
  </div>
);

const Textarea = ({ label, value, onChange, rows = 3 }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
    <textarea value={value} onChange={onChange} rows={rows}
      className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#e8f5f3] focus:outline-none focus:border-teal-400 resize-none transition-colors" />
  </div>
);

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ImageUploader = ({ images, setImages }) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const pickFiles = () => inputRef.current?.click();

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    const valid = files
      .filter((f) => f.type.startsWith('image/'))
      .filter((f) => f.size <= 5 * 1024 * 1024)
      .slice(0, 6);

    if (valid.length === 0) return;
    const urls = await Promise.all(valid.map(fileToDataUrl));
    setImages((prev) => [...prev, ...urls].slice(0, 6));
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    await handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={pickFiles}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pickFiles();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-teal-500 bg-teal-50' : 'border-gray-400 bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <div className="text-5xl leading-none text-gray-700 mb-2">⇪</div>
        <p className="text-xl font-semibold text-gray-900">Click or drag images here</p>
        <p className="text-sm text-gray-600">PNG, JPG, GIF up to 5MB each (max 6)</p>
        <p className="text-xs text-teal-700 mt-1">At least 2 images required for new events</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={`${img.slice(0, 30)}-${idx}`} className="relative border border-gray-200 rounded-xl overflow-hidden">
              <img src={img} alt={`Uploaded ${idx + 1}`} className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/65 text-white text-xs font-bold cursor-pointer"
                aria-label="Remove image"
              >
                ×
              </button>
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px]">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Tab: Basic Info ─────────────────────────────────────────────
const BasicTab = ({ form, set, setImages }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="sm:col-span-2">
        <Input label="Title" value={form.title} onChange={set('title')} required placeholder="Event title" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Community*</label>
        <select value={form.community} onChange={set('community')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#e8f5f3] focus:outline-none focus:border-teal-400">
          {COMMUNITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Input label="Days"   value={form.days}   onChange={set('days')}   type="number" />
      <Input label="Nights" value={form.nights} onChange={set('nights')} type="number" />
      <Input label="Spots Left" value={form.spotsLeft} onChange={set('spotsLeft')} type="number" />
      <Input label="Total Person Booked" value={form.totalBooked} onChange={set('totalBooked')} type="number" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Input label="Price for Local (BDT)"    value={form.price}                onChange={set('price')}                type="number" required />
      <Input label="Price for Foreigner (BDT)" value={form.priceForForeignGuests} onChange={set('priceForForeignGuests')} type="number" />
      <Input label="Total Person" value={form.totalPerson} onChange={set('totalPerson')} type="number" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input label="Location"    value={form.location}    onChange={set('location')}    required />
      <Input label="Sublocation" value={form.sublocation} onChange={set('sublocation')} />
      <Input label="Date From"   value={form.dateFrom}    onChange={set('dateFrom')}    placeholder="12 May" />
      <Input label="Date To"     value={form.dateTo}      onChange={set('dateTo')}      placeholder="16 May" />
      <Input label="Time"        value={form.time}        onChange={set('time')}        placeholder="09:00" />
      <Input label="Division"    value={form.division}    onChange={set('division')} />
    </div>
    <ImageUploader images={form.images} setImages={setImages} />
    <Textarea label="Overview / Description" value={form.description} onChange={set('description')} rows={4} />
  </div>
);

// ── Tab: Itinerary ──────────────────────────────────────────────
const ItineraryTab = ({ itinerary, setItinerary }) => {
  const addDay = () => setItinerary(p => [...p, { day: p.length + 1, title: '', description: '' }]);
  const removeDay = i => setItinerary(p => p.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, day: idx + 1 })));
  const update = (i, f) => e => setItinerary(p => p.map((d, idx) => idx === i ? { ...d, [f]: e.target.value } : d));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-gray-600">Number of Days: <span className="text-teal-600">{itinerary.length}</span></p>
        <button onClick={addDay}
          className="px-3 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer">
          + Add Day
        </button>
      </div>
      {itinerary.map((day, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">Day {day.day}</span>
            <button onClick={() => removeDay(i)}
              className="text-red-400 hover:text-red-600 text-xs font-bold cursor-pointer px-2 py-1 rounded hover:bg-red-50">
              Remove
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Activity Title</label>
              <input value={day.title} onChange={update(i, 'title')} placeholder="Day title"
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-teal-400" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Details of the Activity</label>
              <textarea value={day.description} onChange={update(i, 'description')} rows={2} placeholder="Day description..."
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-teal-400 resize-none" />
            </div>
          </div>
        </div>
      ))}
      {itinerary.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">No days added yet. Click + Add Day.</p>
      )}
    </div>
  );
};

// ── Tab: List editor (Inclusions & Exclusions) ──────────────────
const ListTab = ({ items, setItems, color = 'green' }) => {
  const add    = () => setItems(p => [...p, '']);
  const remove = i  => setItems(p => p.filter((_, idx) => idx !== i));
  const update = i  => e => setItems(p => p.map((v, idx) => idx === i ? e.target.value : v));

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={add}
          className="px-3 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer">
          + Add Item
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold
            ${color === 'green' ? 'bg-green-500' : 'bg-red-400'}`}>
            {color === 'green' ? '✓' : '✕'}
          </span>
          <input value={item} onChange={update(i)} placeholder={`Item ${i + 1}`}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#e8f5f3] focus:outline-none focus:border-teal-400" />
          <button onClick={() => remove(i)}
            className="text-red-400 hover:text-red-600 cursor-pointer p-1 rounded hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-6">No items yet. Click + Add Item.</p>
      )}
    </div>
  );
};

// ── Tab: Terms & Conditions ─────────────────────────────────────
const TermsTab = ({ terms, setTerms }) => {
  const setGeneral = i => e => setTerms(p => ({ ...p, general: p.general.map((v, idx) => idx === i ? e.target.value : v) }));
  const addGeneral = () => setTerms(p => ({ ...p, general: [...p.general, ''] }));
  const removeGeneral = i => setTerms(p => ({ ...p, general: p.general.filter((_, idx) => idx !== i) }));
  const setCancellation = i => e => setTerms(p => ({ ...p, cancellationPolicy: { ...p.cancellationPolicy, points: p.cancellationPolicy.points.map((v, idx) => idx === i ? e.target.value : v) } }));
  const addCancellation = () => setTerms(p => ({ ...p, cancellationPolicy: { ...p.cancellationPolicy, points: [...p.cancellationPolicy.points, ''] } }));

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-600 uppercase">General Terms</p>
          <button onClick={addGeneral} className="px-3 py-1 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer">+ Add</button>
        </div>
        {terms.general.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={item} onChange={setGeneral(i)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#e8f5f3] focus:outline-none focus:border-teal-400" />
            <button onClick={() => removeGeneral(i)} className="text-red-400 hover:text-red-600 cursor-pointer p-1">✕</button>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-600 uppercase">Cancellation Policy Points</p>
          <button onClick={addCancellation} className="px-3 py-1 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer">+ Add</button>
        </div>
        {terms.cancellationPolicy.points.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={item} onChange={setCancellation(i)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-[#e8f5f3] focus:outline-none focus:border-teal-400" />
            <button onClick={() => setTerms(p => ({ ...p, cancellationPolicy: { ...p.cancellationPolicy, points: p.cancellationPolicy.points.filter((_, idx) => idx !== i) } }))}
              className="text-red-400 hover:text-red-600 cursor-pointer p-1">✕</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Textarea label="Liability" value={terms.liability} onChange={e => setTerms(p => ({ ...p, liability: e.target.value }))} />
        <Textarea label="Contact"   value={terms.contact}   onChange={e => setTerms(p => ({ ...p, contact:   e.target.value }))} />
      </div>
    </div>
  );
};

// ── Main EventForm ──────────────────────────────────────────────
const DEFAULT_TERMS = {
  general: ['By booking, you agree to follow the rules of the platform.'],
  cancellationPolicy: { title: 'Cancellation Policy', intro: '', points: ['7+ days before: 80% refund', '3-6 days before: 50% refund', 'Within 48 hours: no refund'] },
  liability: 'Jatra is not responsible for personal injury or loss.',
  contact: 'Contact us through the contact page.',
};

const EventForm = ({ event, onClose, onSaved }) => {
  const isEditing = !!event;
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const [form, setForm] = useState({
    title:                event?.title          || '',
    community:            event?.community      || 'Family',
    days:                 event?.days           || '',
    nights:               event?.nights         || '',
    spotsLeft:            event?.spotsLeft      || '',
    totalBooked:          event?.totalBooked    || 0,
    totalPerson:          event?.totalPerson    || '',
    price:                event?.price          || '',
    priceForForeignGuests:event?.priceForForeignGuests || '',
    location:             event?.location       || '',
    sublocation:          event?.sublocation    || '',
    dateFrom:             event?.dateFrom       || '',
    dateTo:               event?.dateTo         || '',
    time:                 event?.time           || '',
    division:             event?.division       || '',
    images:               event?.images?.length ? event.images : (event?.image ? [event.image] : []),
    description:          event?.description    || '',
  });
  const [itinerary,   setItinerary]   = useState(event?.itinerary   || []);
  const [inclusions,  setInclusions]  = useState(event?.inclusions  || []);
  const [exclusions,  setExclusions]  = useState(event?.exclusions  || []);
  const [disclaimer,  setDisclaimer]  = useState(event?.disclaimer  || '');
  const [terms,       setTerms]       = useState(event?.terms       || DEFAULT_TERMS);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const setImages = (updater) => {
    setForm((prev) => ({
      ...prev,
      images: typeof updater === 'function' ? updater(prev.images || []) : updater,
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.location) {
      setError('Title, Price, and Location are required.'); return;
    }

    const imageUrls = (form.images || []).filter(Boolean);
    if (!isEditing && imageUrls.length < 2) {
      setError('Please upload at least 2 images to create an event.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        image: imageUrls[0] || event?.image || '',
        itinerary,
        inclusions,
        exclusions,
        disclaimer,
        terms,
        images: imageUrls,
        avgRating: event?.avgRating || 4.5,
        reviewCount: event?.reviewCount || 0,
        reviews: event?.reviews || [],
      };

      if (isEditing) {
        await updateEvent(event.id, payload);
      } else {
        await createEvent(payload);
      }

      onSaved();
    } catch (err) {
      console.error('Event save failed:', err);
      setError(err.message || 'Failed to save event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabContent = [
    <BasicTab      form={form} set={set} setImages={setImages} />,
    <ItineraryTab  itinerary={itinerary} setItinerary={setItinerary} />,
    <ListTab       items={inclusions}  setItems={setInclusions}  color="green" />,
    <ListTab       items={exclusions}  setItems={setExclusions}  color="red"   />,
    <Textarea      value={disclaimer} onChange={e => setDisclaimer(e.target.value)} rows={6} />,
    <TermsTab      terms={terms} setTerms={setTerms} />,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-bold text-gray-900">
            {isEditing ? `Edit: ${event.title}` : 'Add New Event'}
          </h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0 border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap
                ${activeTab === i
                  ? 'bg-[#a5d6a7] text-green-900 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">{error}</div>}
          {tabContent[activeTab]}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50">
          <div className="flex gap-2">
            {activeTab > 0 && (
              <button onClick={() => setActiveTab(p => p - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer">← Back</button>
            )}
            {activeTab < TABS.length - 1 && (
              <button onClick={() => setActiveTab(p => p + 1)}
                className="px-4 py-2 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer">Next →</button>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-bold rounded-lg cursor-pointer">
              {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;