"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

/**
 * CategoryCard Component - Image Background Style
 * Images fill the entire card background with overlay text
 */
export default function CategoryCard({ category }) {
    const isNew = category.badge === 'NEW';
    const [imgSrc, setImgSrc] = useState(category.image || null);

    return (
        <Link href={`/products?category=${category.slug}`}>
            <div className="relative aspect-[4/5] h-full cursor-pointer rounded-2xl overflow-hidden group border border-gray-100 hover:border-teal-300 transform hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-sm hover:shadow-2xl">
                {/* Background Image */}
                {imgSrc ? (
                    <Image
                        src={imgSrc}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImgSrc(null)}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-700">
                        {category.icon}
                    </div>
                )}


                {/* Dark Overlay - Premium Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003B4A]/90 via-black/40 to-black/10 group-hover:from-[#003B4A]/95 transition-all duration-500"></div>

                {/* Content - Bottom Aligned */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                    <div className="w-full relative transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col items-center">
                        <h3 className="text-lg md:text-xl font-black text-white text-center uppercase tracking-tight line-clamp-2 drop-shadow-md mb-2">
                            {category.name}
                        </h3>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <span className="text-xs font-bold text-teal-200 uppercase tracking-widest flex items-center gap-1 group/btn">
                                Explore
                                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* NEW Badge */}
                {isNew && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                        NEW
                    </div>
                )}

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
            </div>
        </Link>
    );
}
