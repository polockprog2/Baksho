"use client";

import Link from 'next/link';

function StarRating({ rating }) {
    return (
        <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`w-4 h-4 ${star <= rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
}

export default function RecentReviewsSection({ reviews }) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="relative z-10 py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Real Feedback</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what real customers are saying about our products.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <StarRating rating={review.rating} />
                                {review.product && (
                                    <Link href={`/products/${review.product.id}`} className="mt-3 block">
                                        <span className="text-xs font-bold text-[#003B4A] hover:underline bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm inline-block mb-3 line-clamp-1">
                                            {review.product.name}
                                        </span>
                                    </Link>
                                )}
                                <p className="text-gray-700 italic text-sm leading-relaxed mb-6 line-clamp-4">
                                    "{review.comment}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                                <div className="w-8 h-8 rounded-full bg-[#003B4A] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 line-clamp-1">{review.user?.name || 'Anonymous'}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
