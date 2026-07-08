"use client";

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';

/**
 * Premium Deals Carousel – powered by Embla Carousel
 * Handles mouse drag, touch, momentum, and snap natively.
 */
export default function DealsCarousel({ products, badgeType = 'sale', isLoading = false }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    const onScroll = useCallback(() => {
        if (!emblaApi) return;
        const progress = emblaApi.scrollProgress();
        setScrollProgress(Math.max(0, Math.min(1, progress)) * 100);
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        onScroll();
        emblaApi.on('select', onSelect);
        emblaApi.on('scroll', onScroll);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('scroll', onScroll);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect, onScroll]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <div className="relative group/carousel">
            {/* Glassmorphic Navigation Arrows */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 pointer-events-none ${canScrollPrev ? 'opacity-100 -translate-x-6' : 'opacity-0 translate-x-0'}`}>
                <button
                    onClick={scrollPrev}
                    className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-white hover:scale-110 active:scale-95 transition-all group/arrow"
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 group-hover/arrow:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 transition-all duration-500 pointer-events-none ${canScrollNext ? 'opacity-100 translate-x-6' : 'opacity-0 translate-x-0'}`}>
                <button
                    onClick={scrollNext}
                    className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl flex items-center justify-center text-gray-900 pointer-events-auto hover:bg-white hover:scale-110 active:scale-95 transition-all group/arrow"
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 group-hover/arrow:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Edge Shadow Overlays */}
            <div className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollPrev ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none transition-opacity duration-500 ${canScrollNext ? 'opacity-100' : 'opacity-0'}`} />

            {/* Embla Viewport */}
            <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing pb-3 pt-4 px-2">
                <div className="flex gap-6 md:gap-8">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex-none w-[280px]">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="flex-none w-[280px] hover:z-10 transition-transform duration-500 hover:scale-[1.02]">
                                <ProductCard product={product} badgeType={badgeType} />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-200"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
        </div>
    );
}
