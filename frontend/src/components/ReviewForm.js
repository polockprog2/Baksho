"use client";

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { createReview } from '@/api/product.api';
import Link from 'next/link';

function StarRatingInput({ value, onChange }) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="cursor-pointer transition-transform duration-100 hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                >
                    <svg
                        className={`w-8 h-8 ${star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-sm font-black text-[#003B4A]">
                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
                </span>
            )}
        </div>
    );
}

export default function ReviewForm({ productId, onReviewSubmitted }) {
    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await createReview({ productId, rating, comment: comment.trim() || undefined });
            setRating(0);
            setComment('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
            onReviewSubmitted?.();
        } catch (err) {
            setError(err.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-[#F9F7F2] rounded-3xl p-8 border border-gray-100 text-center">
                <div className="text-3xl mb-3">✍️</div>
                <p className="text-gray-600 font-medium text-sm mb-4">Sign in to leave a review for this product.</p>
                <Link
                    href="/login"
                    className="inline-block bg-[#003B4A] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-lg shadow-[#003B4A]/20"
                >
                    Sign In to Review
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-[#003B4A] mb-6">Write a Review</h3>

            {/* Star Rating */}
            <div className="mb-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    Your Rating *
                </label>
                <StarRatingInput value={rating} onChange={setRating} />
                {error && error.includes('rating') && (
                    <p className="text-red-500 text-xs font-bold mt-2">{error}</p>
                )}
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    Your Review <span className="text-gray-300 font-medium">(optional)</span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    className="w-full px-5 py-4 bg-[#F9F7F2] rounded-2xl text-[#003B4A] font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 placeholder:text-gray-300"
                    maxLength={1000}
                />
                <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-300 font-medium">{comment.length}/1000</span>
                </div>
            </div>

            {/* Error */}
            {error && !error.includes('rating') && (
                <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-red-600 text-xs font-bold">{error}</p>
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <p className="text-emerald-600 text-xs font-bold">✓ Review submitted successfully!</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${isSubmitting || rating === 0
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-[#003B4A] text-white hover:opacity-90 shadow-xl shadow-[#003B4A]/20 active:scale-[0.98]'
                    }`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
