// FILE: src/components/booking/PaymentModal.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Convert number to BDT words (up to crore) ───────────────────
const numberToWords = (num) => {
  if (!num) return 'ZERO TAKA';
  const ones = ['','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE',
    'TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN','SIXTEEN',
    'SEVENTEEN','EIGHTEEN','NINETEEN'];
  const tens = ['','','TWENTY','THIRTY','FORTY','FIFTY','SIXTY','SEVENTY','EIGHTY','NINETY'];

  const below100 = (n) => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n/10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  };
  const below1000 = (n) => {
    if (n < 100) return below100(n);
    return ones[Math.floor(n/100)] + ' HUNDRED' + (n % 100 ? ' ' + below100(n % 100) : '');
  };

  let result = '';
  if (num >= 10000000) {
    result += below1000(Math.floor(num / 10000000)) + ' CRORE ';
    num %= 10000000;
  }
  if (num >= 100000) {
    result += below1000(Math.floor(num / 100000)) + ' LAKH ';
    num %= 100000;
  }
  if (num >= 1000) {
    result += below1000(Math.floor(num / 1000)) + ' THOUSAND ';
    num %= 1000;
  }
  if (num > 0) result += below1000(num);

  return result.trim() + ' TAKA';
};

const PaymentModal = ({ open, onClose, subtotal, submitBooking }) => {
  const navigate  = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [method, setMethod]     = useState(null);   // 'bkash' | 'card'
  const [success, setSuccess]   = useState(false);
  const [bookingId, setBookingId] = useState('');

  if (!open) return null;

  const handlePay = async (selectedMethod) => {
    setMethod(selectedMethod);
    setLoading(true);
    try {
      const result = await submitBooking(selectedMethod);
      setBookingId(result.bookingId);
      setSuccess(true);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onClose();
    navigate('/dashboard/bookings');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? onClose : undefined} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden z-10">

        {/* ── Success state ── */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Booking Confirmed!</h3>
            <p className="text-gray-500 text-sm mb-1">Payment via <span className="font-semibold capitalize">{method}</span></p>
            <p className="text-teal-700 font-bold text-sm mb-6">Booking ID: {bookingId}</p>
            <button onClick={handleDone}
              className="w-full py-3 bg-[#0F393E] hover:bg-teal-700 text-white font-bold rounded-xl transition-all cursor-pointer">
              View My Bookings
            </button>
          </div>
        ) : (
          <>
            {/* ── Summary header ── */}
            <div className="bg-[#0F393E] px-6 py-5 text-center">
              <h3 className="text-white font-extrabold text-lg tracking-wide mb-1">Summary</h3>
              <p className="text-teal-200 text-sm">
                Amount : <span className="text-white font-bold">{subtotal.toLocaleString('en-BD')} (BDT)</span>
              </p>
              <p className="text-teal-300 text-xs mt-1 font-semibold tracking-wide uppercase">
                IN WORD: {numberToWords(subtotal)}
              </p>
            </div>

            <div className="p-6">

              {/* ── Payment method buttons ── */}
              <p className="text-center text-xs text-gray-500 font-semibold uppercase tracking-wide mb-4">
                Choose Payment Method
              </p>

              <div className="flex gap-3 mb-5">
                {/* bKash */}
                <button
                  onClick={() => handlePay('bkash')}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-200 hover:border-pink-400 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {/* bKash logo pill */}
                  <div className="bg-[#E2136E] rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#E2136E] font-extrabold text-[8px]">b</span>
                    </div>
                    <span className="text-white font-extrabold text-sm tracking-tight">bKash</span>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-pink-500 transition-colors font-medium">Mobile Banking</span>
                </button>

                {/* Card */}
                <button
                  onClick={() => handlePay('card')}
                  disabled={loading}
                  className="flex-1 border-2 border-gray-200 hover:border-blue-400 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2"/>
                      <line x1="2" x2="22" y1="10" y2="10"/>
                    </svg>
                    <span className="text-white font-extrabold text-sm">Payment</span>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors font-medium">Card / Bank</span>
                </button>
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-500">
                  <svg className="w-4 h-4 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Processing payment…
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;