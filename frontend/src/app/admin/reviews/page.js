"use client";

import { useState, useEffect, useCallback } from 'react';
import { deleteReview, getProductReviews } from '@/api/product.api';
import { getProducts } from '@/api/product.api';
import { toast } from 'react-hot-toast';

function StarDisplay({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Load products list for filter
    useEffect(() => {
        getProducts({ limit: 200 })
            .then(data => setProducts(data.data || []))
            .catch(() => {})
            .finally(() => setIsLoadingProducts(false));
    }, []);

    const fetchReviews = useCallback(async (productId) => {
        if (!productId) { setReviews([]); return; }
        setIsLoading(true);
        try {
            const data = await getProductReviews(productId, 1, 50);
            setReviews(data.data || []);
        } catch {
            toast.error('Failed to load reviews');
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews(selectedProductId);
    }, [selectedProductId, fetchReviews]);

    const handleDelete = async (reviewId) => {
        if (!confirm('Delete this review?')) return;
        try {
            await deleteReview(reviewId);
            toast.success('Review deleted');
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch {
            toast.error('Failed to delete review');
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-900">Review Moderation</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">View and delete customer product reviews</p>
            </div>

            {/* Product Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[240px]">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Filter by Product</label>
                    {isLoadingProducts ? (
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                    ) : (
                        <select
                            value={selectedProductId}
                            onChange={e => setSelectedProductId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#003B4A] transition-all"
                        >
                            <option value="">— Select a product —</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    )}
                </div>
                {avgRating && (
                    <div className="text-center px-4">
                        <p className="text-2xl font-black text-[#003B4A]">{avgRating}</p>
                        <StarDisplay rating={Math.round(parseFloat(avgRating))} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{reviews.length} reviews</p>
                    </div>
                )}
            </div>

            {/* Reviews Table */}
            {!selectedProductId ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="text-5xl mb-4">⭐</div>
                    <p className="text-slate-500 font-bold text-sm">Select a product to view its reviews</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    {['Customer', 'Rating', 'Review', 'Date', ''].map(h => (
                                        <th key={h} className="px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-5 py-4 h-16 bg-slate-50/50" />
                                        </tr>
                                    ))
                                ) : reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-16 text-center text-slate-400 text-sm font-bold">No reviews for this product yet.</td>
                                    </tr>
                                ) : reviews.map(review => (
                                    <tr key={review.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#003B4A] rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                                    {review.user?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{review.user?.name || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StarDisplay rating={review.rating} />
                                        </td>
                                        <td className="px-5 py-4 max-w-xs">
                                            <p className="text-sm text-slate-600 line-clamp-2">{review.comment || <span className="text-slate-300 italic">No comment</span>}</p>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-400 font-medium whitespace-nowrap">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                                title="Delete review"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
