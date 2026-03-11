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
            <div className="relative aspect-[4/5] h-full cursor-pointer rounded-2xl overflow-hidden group border-2 border-gray-100 hover:border-green-300 transform hover:scale-105 active:scale-95 transition-all duration-500 hover:shadow-2xl">
                {/* Background Image */}
                {imgSrc ? (
                    <Image
                        src={imgSrc}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={() => setImgSrc('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400')}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-700">
                        {category.icon}
                    </div>
                )}


                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500"></div>

                {/* Content - Centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <h3 className="text-sm md:text-base font-black text-white text-center uppercase tracking-tight line-clamp-2 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300">
                        {category.name}
                    </h3>
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
