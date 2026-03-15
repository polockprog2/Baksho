"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getProducts } from '@/api/product.api';
import { flattenProduct } from '@/utils/helpers';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * Weekly Deals Page - Premium Overhaul
 * Featuring high-urgency elements, countdowns, and professional layout.
 */
export default function WeeklyDealsPage() {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Simulated countdown to next Monday
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const nextMonday = new Date();
            nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
            nextMonday.setHours(0, 0, 0, 0);

            const difference = nextMonday - now;
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setIsLoading(true);
                // Fetch products with discount=true and high discount threshold for "Weekly" status
                const response = await getProducts({ discount: 'true', limit: 20 });
                const allProducts = response.data || response;
                const deals = Array.isArray(allProducts)
                    ? allProducts.map(flattenProduct).filter(p => (p.discount || 0) >= 15).slice(0, 12)
                    : [];
                setProducts(deals);
            } catch (err) {
                console.error('Failed to fetch weekly deals:', err);
                setError(t.error_loading_deals || 'Failed to load weekly deals');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeals();
    }, [t.error_loading_deals]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
                <LoadingSpinner size="lg" text={t.finding_flash_deals || "Accessing flash deals..."} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Urgent Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#8E1616] to-[#D32F2F] text-white py-24 md:py-32">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-400/10 to-transparent transform -skew-x-12 translate-x-32"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-white text-red-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-xl">
                                <span className="animate-pulse">🔴</span> {t.live_now || "LIVE: LIMITED TIME OFFERS"}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
                                {t.weekly_deals_title || "Weekly Deals"}
                            </h1>
                            <p className="text-xl md:text-2xl text-red-100/80 mb-10 max-w-xl font-medium leading-relaxed">
                                {t.weekly_deals_subtitle || "Exclusive flash sales on high-demand premium products. Refreshing every Monday morning."}
                            </p>

                            {/* Countdown Display */}
                            <div className="flex gap-4 md:gap-6 mb-12">
                                {[
                                    { label: t.days || 'Days', value: timeLeft.days },
                                    { label: t.hours || 'Hrs', value: timeLeft.hours },
                                    { label: t.mins || 'Min', value: timeLeft.minutes },
                                    { label: t.secs || 'Sec', value: timeLeft.seconds }
                                ].map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-2xl md:text-3xl font-black mb-2 shadow-inner">
                                            {String(unit.value).padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-red-200">{unit.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="#deals-grid"
                                    className="px-10 py-5 bg-white text-red-700 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl active:scale-95"
                                >
                                    {t.claim_deals || "Claim Deals Now"}
                                </Link>
                            </div>
                        </div>

                        {/* Urgency Badge Visual */}
                        <div className="hidden lg:flex justify-center items-center">
                            <div className="relative w-80 h-80 animate-slow-spin-y">
                                <div className="absolute inset-0 bg-red-400 rounded-full blur-[100px] opacity-20"></div>
                                <div className="relative w-full h-full border-[20px] border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-7xl mb-2">🔥</div>
                                        <div className="text-4xl font-black uppercase tracking-tighter">UP TO</div>
                                        <div className="text-8xl font-black text-amber-400 leading-none">40%</div>
                                        <div className="text-2xl font-black uppercase tracking-[0.3em] mt-2">OFF</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deals Grid */}
            <section id="deals-grid" className="py-24 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length > 0 ? (
                        <>
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
                                        <span className="text-xs font-black text-red-600 uppercase tracking-widest">{t.time_sensitive || "TIME SENSITIVE"}</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] tracking-tighter uppercase">{t.active_flash_sales || "This Week's Flash Sales"}</h2>
                                </div>
                                <div className="px-6 py-3 bg-[#F4F4F4] rounded-xl border border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-widest">
                                    {products.length} {t.active_deals || "active deals"}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                                {products.map((product, index) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[4rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <div className="text-9xl mb-8">🫙</div>
                            <h2 className="text-4xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tight">
                                {error || (t.sold_out_deals || "All Weekly Deals Claimed")}
                            </h2>
                            <p className="text-gray-500 text-lg font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                                Our community moves fast! Every single weekly deal has been claimed. New stock arrives this Monday at midnight sharp.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-3 px-12 py-6 bg-[#1A1A1A] text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:translate-y-[-4px] transition-all shadow-xl active:scale-95"
                            >
                                {t.explore_catalog || "Explore Full Catalog"}
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter section with higher impact */}
            <section className="py-24 bg-[#1A1A1A] text-white overflow-hidden relative">
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 mb-8">
                        <span className="text-5xl">📧</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        {t.never_miss_deal || "Never Miss a Single Deal"}
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Be the first to receive the Monday Morning Flash bulletin. Limited items often sell out within the first hour.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                        <input
                            type="email"
                            placeholder={t.email_placeholder || "your@email.com"}
                            className="flex-1 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder:text-gray-600"
                        />
                        <button className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-2xl active:scale-95">
                            {t.subscribe_flash || "Get Priority Access"}
                        </button>
                    </div>
                    <p className="mt-8 text-xs font-bold text-gray-600 uppercase tracking-widest">
                        🛡️ {t.unsubscribe_anytime || "NO SPAM. UNSUBSCRIBE ANYTIME."}
                    </p>
                </div>
            </section>
        </div>
    );
}

