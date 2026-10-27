import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export const ReviewModal = ({ isOpen, onClose, booking }) => {
  const { addReview } = useBooking();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      restaurant_id: 'rest-qaswa-01',
      booking_id: booking?.id || null,
      customer_name: user?.name || booking?.customer_name || 'Guest Gourmet',
      rating,
      comment,
      table_type: booking?.zone_name || 'Summit Hill Terrace'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-900 to-stone-800 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-white">Rate Your Dining Experience</h3>
            <p className="text-xs text-stone-400">Qaswa Hills Restaurant</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">Thank You for Your Feedback!</h4>
              <p className="text-xs text-stone-400">Your review helps us maintain royal dining standards.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating Selector */}
              <div className="text-center py-2">
                <p className="text-xs text-stone-400 mb-2">Select Star Rating</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-400 mt-1 inline-block">
                  {rating === 5 ? 'Exceptional 5/5' : rating === 4 ? 'Very Good 4/5' : rating === 3 ? 'Average 3/5' : 'Needs Improvement'}
                </span>
              </div>

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Your Review & Dining Comments
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the cliffside ambiance, taste of dishes, butler service, and hospitality..."
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-900/30"
              >
                Submit Verified Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
