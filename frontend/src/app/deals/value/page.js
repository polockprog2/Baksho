"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { getProducts } from '@/api/product.api';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * Value Deals Page - Premium Overhaul
 * Featuring optimized loading, sleek gradients, and glassmorphism.
 */
export default function ValueDealsPage() {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setIsLoading(true);
                // Optimized backend fetching using the discount=true filter
                const response = await getProducts({ discount: 'true', limit: 20 });
                const allProducts = response.data || response;
                // Filter for general value deals (e.g., at least 10% discount)
                const deals = Array.isArray(allProducts)
                    ? allProducts.filter(p => (p.discount || 0) >= 10).slice(0, 12)
                    : [];
                setProducts(deals);
            } catch (err) {
                console.error('Failed to fetch value deals:', err);
                setError(t.error_loading_deals || 'Failed to load value deals');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeals();
    }, [t.error_loading_deals]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
                <LoadingSpinner size="lg" text={t.loading_deals || "Finding the best deals..."} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2]">
            {/* Split Hero Section */}
            <section className="relative overflow-hidden bg-[#003B4A] text-white py-24 md:py-32">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/20 to-transparent skew-x-12 transform translate-x-24"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-lg shadow-amber-500/20">
                                <span>💰</span> {t.everyday_low_prices || "VALUE SAVINGS"}
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                                {t.value_deals_title || "Value Deals"}
                            </h1>
                            <p className="text-xl md:text-2xl text-amber-50/80 mb-10 max-w-xl font-medium leading-relaxed">
                                {t.value_deals_subtitle || "Wallet-friendly prices on quality products. Get more for your money every single day."}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="#deals-grid"
                                    className="px-8 py-4 bg-white text-[#003B4A] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-amber-50 transition-all shadow-xl active:scale-95"
                                >
                                    {t.shop_deals || "Shop Now"}
                                </Link>
                                <div className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 font-bold text-sm tracking-wide">
                                    <span className="text-amber-400 font-black">100%</span> {t.quality_guaranteed || "Quality Assured"}
                                </div>
                            </div>
                        </div>

                        {/* Visual element for Hero - Glassmorphism Card */}
                        <div className="hidden lg:block relative p-12">
                            <div className="w-full aspect-square relative animate-float">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[3rem] blur-3xl opacity-30"></div>
                                <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl overflow-hidden">
                                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl"></div>
                                    <div className="text-6xl mb-4">🏷️</div>
                                    <div>
                                        <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{t.smart_shopping || "Smart Shopping"}</h2>
                                        <p className="text-amber-100/70 font-medium">Save money without ever compromising on the quality of your essentials.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid Section */}
            <section id="deals-grid" className="py-24 -mt-12 md:-mt-20 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#003B4A] uppercase tracking-wider">{t.curated_savings || "CURATED SAVINGS"}</h2>
                                    <div className="h-1 bg-amber-500 w-12 rounded-full"></div>
                                </div>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    {products.length} {t.deals_found || "deals found"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {products.map((product, index) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-gray-100">
                            <div className="text-8xl mb-6">🔍</div>
                            <h2 className="text-3xl font-black text-[#003B4A] mb-4 uppercase tracking-tight">
                                {error || (t.no_deals_found || "No Value Deals Currently")}
                            </h2>
                            <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto">
                                Check back soon! We update our value deals daily to ensure you get the best prices on your favorite items.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-[#003B4A] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl active:scale-95"
                            >
                                {t.browse_all || "Browse All Products"} →
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Savings Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-10 rounded-[2.5rem] bg-[#F9F7F2] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 bg-amber-100 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">📉</div>
                            <h3 className="text-xl font-black text-[#003B4A] mb-4 uppercase tracking-tight">{t.lowest_price || "Market Lowest"}</h3>
                            <p className="text-gray-600 font-medium">We monitor market prices daily to ensure our value deals are unbeatable.</p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-[#F9F7F2] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 bg-green-100 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">✓</div>
                            <h3 className="text-xl font-black text-[#003B4A] mb-4 uppercase tracking-tight">{t.premium_quality || "Premium Only"}</h3>
                            <p className="text-gray-600 font-medium">Unlike others, our value deals include top-tier brands and local organic produce.</p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-[#F9F7F2] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 bg-blue-100 rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🚚</div>
                            <h3 className="text-xl font-black text-[#003B4A] mb-4 uppercase tracking-tight">{t.free_shipping || "Free Shipping"}</h3>
                            <p className="text-gray-600 font-medium">Apply value deals to reach your €50 threshold and get free doorstep delivery.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-[#003B4A] to-[#00222a] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#003B4A]/40">
                        {/* Abstract background element */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight">
                            {t.start_saving_now || "Start Your Smart Savings Journey Today"}
                        </h2>
                        <p className="text-xl text-amber-50/70 mb-12 max-w-2xl mx-auto relative z-10">
                            Join thousands of happy shoppers who save up to 40% on their weekly groceries by shopping our curated deals.
                        </p>
                        <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/products"
                                className="px-12 py-5 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-amber-600 transition-all shadow-xl active:scale-95"
                            >
                                {t.browse_collection || "Browse Collection"}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

