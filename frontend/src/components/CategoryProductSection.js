"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { getProducts } from '@/api/product.api';
import { flattenProduct } from '@/utils/helpers';

/**
 * CategoryProductSection – powered by Embla Carousel
 * Horizontal product carousel with mouse drag, touch, and arrow nav.
 */
export default function CategoryProductSection({ category, title, viewAllLink, limit = 10 }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await getProducts({ category: category.slug, limit });
                const productsArray = response.data || response;
                setProducts(productsArray.map(flattenProduct));
            } catch (error) {
                console.error(`Failed to fetch products for category ${category.slug}:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        if (category?.slug) {
            fetchProducts();
        }
    }, [category, limit]);

    // Re-init Embla after products load so it measures correctly
    useEffect(() => {
        if (emblaApi) emblaApi.reInit();
    }, [products, emblaApi]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    if (!isLoading && products.length === 0) return null;

    return (
        <section className="relative py-24 bg-white overflow-hidden first:pt-12">
            {/* Background Decorations */}
            <div className="absolute top-1/2 -right-24 w-64 h-64 bg-green-50/50 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 -left-12 w-48 h-48 bg-emerald-50/30 rounded-full blur-2xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-10 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/20"></div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                {title || category.name}
                            </h2>
                        </div>
                        <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-transparent rounded-full"></div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href={viewAllLink || `/products?category=${category.slug}`}
                            className="text-sm font-black text-green-600 hover:text-green-700 transition-all uppercase tracking-widest hidden sm:block border-b-2 border-transparent hover:border-green-600 pb-1"
                        >
                            Explore All
                        </Link>

                        <div className="flex gap-3">
                            <button
                                onClick={scrollPrev}
                                disabled={!canScrollPrev}
                                className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm shadow-sm ${canScrollPrev
                                    ? 'hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-xl hover:scale-110 active:scale-90'
                                    : 'opacity-30 cursor-not-allowed'
                                    }`}
                                aria-label="Scroll left"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={scrollNext}
                                disabled={!canScrollNext}
                                className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm shadow-sm ${canScrollNext
                                    ? 'hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-xl hover:scale-110 active:scale-90'
                                    : 'opacity-30 cursor-not-allowed'
                                    }`}
                                aria-label="Scroll right"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Embla Carousel */}
                <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing -mx-2 px-2">
                    <div className="flex gap-4 md:gap-8 pb-8 pt-2">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="flex-none w-[200px] md:w-72">
                                    <SkeletonCard />
                                </div>
                            ))
                        ) : (
                            products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex-none w-[200px] md:w-72 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Mobile View All */}
                <div className="mt-8 sm:hidden px-2">
                    <Link
                        href={viewAllLink || `/products?category=${category.slug}`}
                        className="flex items-center justify-center w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-sm font-black text-white rounded-2xl hover:shadow-lg transition-all uppercase tracking-widest active:scale-[0.98]"
                    >
                        View More {category.name}
                    </Link>
                </div>
            </div>
        </section>
    );
}
