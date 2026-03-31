"use client";

import { useState, useEffect } from 'react';
import { getProductReviews } from '@/api/product.api';

function StarRating({ rating, interactive = false, onRate }) {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => interactive && onRate?.(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={`transition-transform duration-100 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                    aria-label={`${star} star`}
                >
                    <svg
                        className={`w-5 h-5 ${star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review }) {
    const initials = review.user?.name
        ? review.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    const date = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <div className="bg-[#F9F7F2] rounded-2xl p-5 border border-gray-100">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#003B4A] rounded-full flex items-center justify-center text-white text-xs font-black">
                    {review.user?.image ? (
                        <img
                            src={review.user.image}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-black text-[#003B4A]">{review.user?.name || 'Anonymous'}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400 font-medium">{date}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    {review.comment && (
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed font-medium">{review.comment}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ReviewList({ productId, refreshKey = 0 }) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const LIMIT = 5;

    useEffect(() => {
        if (!productId) return;
        setIsLoading(true);
        getProductReviews(productId, page, LIMIT)
            .then(data => {
                setReviews(data.data || []);
                setAverageRating(data.averageRating || 0);
                setTotalReviews(data.totalReviews || 0);
                setTotalPages(data.meta?.totalPages || 1);
            })
            .catch(() => {
                setReviews([]);
            })
            .finally(() => setIsLoading(false));
    }, [productId, page, refreshKey]);

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
    }));

    return (
        <div>
            {/* Summary */}
            {totalReviews > 0 && (
                <div className="flex flex-col sm:flex-row gap-8 mb-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-center flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-[#003B4A]">{averageRating.toFixed(1)}</span>
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{totalReviews} Reviews</span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {ratingDistribution.map(({ star, count, pct }) => (
                            <div key={star} className="flex items-center gap-2">
                                <span className="text-xs font-black text-gray-500 w-4 text-right">{star}</span>
                                <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-400 w-8">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-2xl h-24 animate-pulse" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-[#F9F7F2] rounded-2xl border border-gray-100">
                    <div className="text-4xl mb-3">⭐</div>
                    <p className="text-gray-500 font-bold text-sm">No reviews yet. Be the first to leave one!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest disabled:opacity-30 bg-[#F9F7F2] text-[#003B4A] hover:bg-[#003B4A] hover:text-white transition-all"
                    >← Prev</button>
                    <span className="text-sm font-bold text-gray-400">{page} / {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest disabled:opacity-30 bg-[#F9F7F2] text-[#003B4A] hover:bg-[#003B4A] hover:text-white transition-all"
                    >Next →</button>
                </div>
            )}
        </div>
    );
}
