"use client";

import Link from 'next/link';

/**
 * AdvancedCategoryCard Component
 * A premium category card with glassmorphism, hover animations, and background glow
 */
export default function AdvancedCategoryCard({ category }) {
    return (
        <Link
            href={`/products?category=${category.slug}`}
            className="group"
        >
            <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-gradient-to-br from-green-300/30 to-emerald-300/20 blur-2xl -z-10"></div>

                {/* Card */}
                <div className="aspect-square rounded-2xl bg-white/60 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-green-400 group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:bg-white/80">
                    {category.image ? (
                        <div className="w-full h-full relative">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ) : (
                        <span className="text-5xl group-hover:scale-150 transition-transform duration-500 drop-shadow-lg">
                            {category.icon || '📦'}
                        </span>
                    )}
                </div>

                {/* Label with Animation */}
                <div className="mt-4 text-center space-y-2">
                    <span className="text-sm md:text-base font-black text-gray-800 group-hover:text-green-600 transition-colors uppercase tracking-tight block">
                        {category.name}
                    </span>
                    {/* Animated Underline */}
                    <div className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
                </div>
            </div>
        </Link>
    );
}
