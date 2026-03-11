"use client";

import { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

/**
 * Premium Deals Carousel
 * Supports smooth horizontal scrolling, glassmorphic navigation, and refined layout.
 */
export default function DealsCarousel({ products, badgeType = 'sale', isLoading = false }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkArrows = () => {
        const container = scrollRef.current;
        if (container) {
            setShowLeftArrow(container.scrollLeft > 10);
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener('scroll', checkArrows);
            window.addEventListener('resize', checkArrows);
            checkArrows();
            return () => {
                container.removeEventListener('scroll', checkArrows);
                window.removeEventListener('resize', checkArrows);
            };
        }
    }, [products, isLoading]);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group/carousel">
            {/* Glassmorphic Navigation Arrows */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 pointer-events-none ${showLeftArrow ? 'opacity-100 -translate-x-6' : 'opacity-0 translate-x-0'}`}>
                <button
                    onClick={() => scroll('left')}
                    className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-white hover:scale-110 active:scale-95 transition-all group/arrow"
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 group-hover/arrow:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 pointer-events-none ${showRightArrow ? 'opacity-100 translate-x-6' : 'opacity-0 translate-x-0'}`}>
                <button
                    onClick={() => scroll('right')}
                    className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-white hover:scale-110 active:scale-95 transition-all group/arrow"
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 group-hover/arrow:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Edge Shadow Overlays for depth */}
            <div className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none transition-opacity duration-500 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none transition-opacity duration-500 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />

            {/* Carousel Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-3 pt-4 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-[280px]">
                            <SkeletonCard />
                        </div>
                    ))
                ) : (
                    products.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[280px] hover:z-10 transition-transform duration-500 hover:scale-[1.02]"
                        >
                            <ProductCard product={product} badgeType={badgeType} />
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Line / Progress (Optional but premium) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                    style={{
                        width: products.length > 0 ? `${((scrollRef.current?.scrollLeft || 0) + (scrollRef.current?.clientWidth || 0)) / (scrollRef.current?.scrollWidth || 1) * 100}%` : '0%'
                    }}
                />
            </div>
        </div>
    );
}

