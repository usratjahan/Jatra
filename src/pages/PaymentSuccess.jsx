import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (!user) {
      navigate('/', { state: { openLogin: true, returnTo: `/payment/success?booking_id=${bookingId}` } });
      return;
    }

    // In a real implementation, you might want to verify the payment status
    // For now, we'll just show success and redirect to bookings
    setLoading(false);
  }, [user, bookingId, navigate]);

  const handleViewBookings = () => {
    navigate('/dashboard/bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>
        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
          </p>
        )}
        <button
          onClick={handleViewBookings}
          className="w-full py-3 bg-[#0F393E] hover:bg-teal-700 text-white font-bold rounded-xl transition-all duration-200"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;