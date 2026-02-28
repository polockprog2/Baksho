"use client";

import { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

/**
 * DealsCarousel Component - Jamoona Style
 * Horizontal scrolling carousel for deals sections
 */
export default function DealsCarousel({ title, products, badgeType = 'sale', isLoading = false }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (container) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            // Update arrow visibility
            setTimeout(() => {
                setShowLeftArrow(container.scrollLeft > 0);
                setShowRightArrow(
                    container.scrollLeft < container.scrollWidth - container.clientWidth - 10
                );
            }, 300);
        }
    };

    return (
        <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 group">
                    <div className="flex items-center gap-3">
                        {title && (
                            <>
                                <div className="w-1.5 h-8 bg-green-600 rounded-full"></div>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
                                    {title}
                                </h2>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!showLeftArrow}
                            className={`w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all ${showLeftArrow
                                ? 'hover:bg-green-50 hover:border-green-500 text-gray-700'
                                : 'opacity-30 cursor-not-allowed'
                                }`}
                            aria-label="Scroll left"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!showRightArrow}
                            className={`w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all ${showRightArrow
                                ? 'hover:bg-green-50 hover:border-green-500 text-gray-700'
                                : 'opacity-30 cursor-not-allowed'
                                }`}
                            aria-label="Scroll right"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {isLoading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-64">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-64">
                                <ProductCard product={product} badgeType={badgeType} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
