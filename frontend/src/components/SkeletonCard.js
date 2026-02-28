"use client";

import React from 'react';

/**
 * SkeletonCard Component
 * A placeholder card with shimmer effect for loading states
 */
export default function SkeletonCard() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Return empty placeholder with same dimensions for SSR to avoid layout shift
    // but without the flickering/mismatching style tags
    if (!mounted) {
        return <div className="bg-white border-2 border-gray-100 rounded-2xl h-[400px] w-full p-4" />;
    }

    return (
        <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden h-full flex flex-col p-4 animate-pulse">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>

            {/* Title Skeleton */}
            <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded-full w-1/2 mb-4"></div>

            {/* Subtext Skeleton */}
            <div className="h-3 bg-gray-50 rounded-full w-1/4 mb-4"></div>

            {/* Rating Skeleton */}
            <div className="flex gap-1 mb-4">
                <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
                <div className="w-8 h-3 bg-gray-100 rounded-full"></div>
            </div>

            {/* Price & Button Skeleton */}
            <div className="mt-auto flex justify-between items-end">
                <div className="h-6 bg-gray-100 rounded-full w-1/3"></div>
                <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                    background-size: 200% 100%;
                }
            `}</style>
        </div>
    );
}
