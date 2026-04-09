import React from "react";

const Stars = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <svg key={s} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
        fill={s <= rating ? "#ECC62D" : "#E5E7EB"}
        stroke={s <= rating ? "#ECC62D" : "#E5E7EB"}
        strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const ReviewTab = ({ avgRating = 0, reviewCount = 0, reviews = [] }) => {
  // TODO: POST /api/events/:id/reviews → { rating, comment }
  // Add a review submission form here when auth is ready

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-teal-700">{avgRating.toFixed(1)}</p>
          <Stars rating={Math.round(avgRating)} size={16} />
          <p className="text-gray-500 text-xs mt-1">{reviewCount} reviews</p>
        </div>
        <div className="flex-1 text-sm text-gray-500 leading-relaxed">
          {reviewCount > 0
            ? `Based on ${reviewCount} traveler reviews who have visited this destination with Jatra.`
            : "No reviews yet. Be the first to share your experience!"}
        </div>
      </div>

      {/* Review cards */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">💬</div>
          <p className="font-semibold">No reviews yet</p>
          <p className="text-xs mt-1">Reviews from Jatra travelers will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {review.userName?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{review.userName}</p>
                    <p className="text-gray-400 text-xs">{review.date}</p>
                  </div>
                </div>
                <Stars rating={review.rating} size={13} />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-11">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* TODO: Add review form when auth is ready */}
      {/* <WriteReviewForm eventId={eventId} /> */}

    </div>
  );
};

export default ReviewTab;