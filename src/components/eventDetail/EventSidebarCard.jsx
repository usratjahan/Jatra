import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Row = ({ icon, label, value, bold }) => (
  <div className="flex flex-col gap-1.5 py-2 border-b border-gray-100 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
    <div className="flex items-center gap-2 text-gray-500 text-xs min-w-0">
      {icon}
      <span className="truncate">{label}</span>
    </div>
    <span className={`text-xs text-left sm:text-right ${bold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
      {value}
    </span>
  </div>
);

const EventSidebarCard = ({ event }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBook = () => {
    if (!user) {
      sessionStorage.setItem('pendingBooking', `/booking/${event.id}`);
      navigate('/', { state: { openLogin: true, returnTo: `/booking/${event.id}` } });
      return;
    }
    navigate(`/booking/${event.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:sticky lg:top-24">
      <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400" />
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div>
            <p className="text-gray-900 font-bold text-sm leading-tight">{event.location}</p>
            <p className="text-gray-500 text-xs">{event.sublocation}</p>
          </div>
        </div>
        <div className="mb-4">
          <Row icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>} label="Date" value={`${event.dateFrom} – ${event.dateTo}`} />
          <Row icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Time" value={event.time} />
          <Row icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="Spots left" value={`${event.spotsLeft} available`} bold />
          <Row icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"/></svg>} label="Price (locals)" value={`BDT ${event.price.toLocaleString('en-BD')}`} bold />
          <Row icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>} label="Foreign guests" value={`BDT ${event.priceForForeignGuests?.toLocaleString('en-BD') ?? 'N/A'}`} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {[1,2,3,4,5].map((s) => (
            <svg key={s} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill={s <= Math.round(event.avgRating ?? event.rating) ? '#ECC62D' : '#E5E7EB'}
              stroke={s <= Math.round(event.avgRating ?? event.rating) ? '#ECC62D' : '#E5E7EB'}
              strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          ))}
          <span className="text-gray-500 text-xs ml-1">({event.reviewCount ?? event.reviews?.length} reviews)</span>
        </div>
        <button onClick={handleBook}
          className="w-full py-3.5 bg-[#0F393E] hover:bg-teal-700 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm tracking-wide">
          {user ? 'Proceed to Book' : '🔒 Login to Book'}
        </button>
        {!user && (
          <p className="text-center text-xs text-gray-400 mt-2">Login required to book this event</p>
        )}
      </div>
    </div>
  );
};

export default EventSidebarCard;