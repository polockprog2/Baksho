"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { getProducts } from '@/api/product.api';
import { flattenProduct } from '@/utils/helpers';

/**
 * CategoryProductSection Component
 * Displays a horizontal carousel of products for a specific category
 */
export default function CategoryProductSection({ category, title, viewAllLink, limit = 10 }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

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

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (container) {
            const scrollAmount = window.innerWidth < 768 ? 200 : 400;
            const newScrollLeft = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });

            setTimeout(() => {
                setShowLeftArrow(container.scrollLeft > 5);
                setShowRightArrow(
                    container.scrollLeft < container.scrollWidth - container.clientWidth - 10
                );
            }, 300);
        }
    };

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
                                onClick={() => scroll('left')}
                                disabled={!showLeftArrow}
                                className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm shadow-sm ${showLeftArrow
                                    ? 'hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-xl hover:scale-110 active:scale-90'
                                    : 'opacity-30 cursor-not-allowed'
                                    }`}
                                aria-label="Scroll left"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!showRightArrow}
                                className={`w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all bg-white/80 backdrop-blur-sm shadow-sm ${showRightArrow
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

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-8 pt-2 -mx-2 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[200px] md:w-72">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        products.map((product, index) => (
                            <div
                                key={product.id}
                                className="flex-shrink-0 w-[200px] md:w-72 animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))
                    )}
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
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
