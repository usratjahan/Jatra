// FILE: src/components/booking/BookingSummaryCard.jsx

import React from 'react';

const BookingSummaryCard = ({
  priceType,
  setPriceType,
  totalTravelers,
  unitPrice,
  subtotal,
  termsAccepted,
  setTermsAccepted,
  onSubmit,
  error,
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">

    {/* Header strip */}
    <div className="h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400" />

    <div className="p-5">
      <h3 className="font-extrabold text-gray-900 text-base mb-4">Booking Summary</h3>

      {/* Tour Price */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Tour Price</p>
        <div className="bg-teal-600 rounded-xl px-4 py-3 text-center">
          <p className="text-white font-extrabold text-lg">
            {unitPrice.toLocaleString('en-BD')} BDT
          </p>
          <p className="text-teal-200 text-xs mt-0.5">per person</p>
        </div>
      </div>

      {/* Local / Foreigner toggle */}
      <div className="flex items-center gap-6 mb-5">
        {['local', 'foreigner'].map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input
                type="radio"
                name="priceType"
                value={type}
                checked={priceType === type}
                onChange={() => setPriceType(type)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                priceType === type ? 'border-teal-600' : 'border-gray-300'
              }`}>
                {priceType === type && (
                  <div className="w-2 h-2 rounded-full bg-teal-600" />
                )}
              </div>
            </div>
            <span className={`text-sm font-medium capitalize ${
              priceType === type ? 'text-teal-700' : 'text-gray-500'
            }`}>
              {type === 'local' ? 'Local' : 'Foreigner'}
            </span>
          </label>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-200 my-4" />

      {/* Person count */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Person × {totalTravelers}
        </span>
        <span className="text-sm font-semibold text-gray-700">
          {unitPrice.toLocaleString('en-BD')} × {totalTravelers}
        </span>
      </div>

      {/* Subtotal */}
      <div className="bg-teal-600 rounded-xl px-4 py-3 text-center mb-5">
        <p className="text-teal-200 text-xs font-semibold uppercase tracking-wide mb-0.5">Subtotal</p>
        <p className="text-white font-extrabold text-xl">
          {subtotal.toLocaleString('en-BD')} BDT
        </p>
      </div>

      {/* Terms checkbox */}
      <label className="flex items-start gap-2.5 cursor-pointer mb-5">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="sr-only"
          />
          <div
            onClick={() => setTermsAccepted(!termsAccepted)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
              termsAccepted ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'
            }`}>
            {termsAccepted && (
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          I accept the Refund Policy and{' '}
          <span className="text-teal-600 font-medium">Terms & Conditions</span>
        </p>
      </label>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={onSubmit}
        className="w-full py-3.5 bg-[#0F393E] hover:bg-teal-700 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm tracking-wide cursor-pointer"
      >
        Submit
      </button>

    </div>
  </div>
);

export default BookingSummaryCard;