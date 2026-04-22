import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (!user) {
      navigate('/', { state: { openLogin: true, returnTo: `/payment/cancel?booking_id=${bookingId}` } });
      return;
    }
  }, [user, bookingId, navigate]);

  const handleTryAgain = () => {
    if (bookingId) {
      navigate(`/booking/${bookingId}`);
    } else {
      navigate('/events');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You cancelled the payment process. Your booking is still pending and you can try payment again.
        </p>
        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
          </p>
        )}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full py-3 bg-[#0F393E] hover:bg-teal-700 text-white font-bold rounded-xl transition-all duration-200"
          >
            Complete Payment
          </button>
          <button
            onClick={handleGoHome}
            className="w-full py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;