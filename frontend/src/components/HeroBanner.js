"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import GroceryHeroCharacter from '@/components/ui/GroceryHeroCharacter';

/**
 * HeroBanner Component - Grocero Style
 * Premium grocery store hero with gradient background, glassmorphism,
 * micro-animations, and refined typography
 */
export default function HeroBanner({ content }) {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const displayTitle = content?.hero_title || "Your One-Stop Shop for Organic Products";
    const displayDesc = content?.hero_desc || "Fresh. Halal. Delivered to Your Door — We care about what goes into your kitchen for your better life and better health.";
    const displayCTA = content?.hero_cta || t.shop_now || "Shop Now";
    const displayImage = content?.hero_image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200";
    const displayBadgeText = content?.hero_badge_text || "The best offline grocery store in Germany";
    const displayRating = content?.hero_rating || "4.8 Ratings";
    const displayTrustText = content?.hero_trust_text || "Trusted by 12k+ Customers";

    const titleParts = displayTitle.split("for ");
    const titleBefore = titleParts[0];
    const highlightWord = titleParts.length > 1 ? titleParts[1] : "";

    return (
        <>
            {/* ─── Hero Section ─── */}
            <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #ecfdf5 70%, #f0fdf4 100%)' }}>

                {/* Decorative blobs */}
                <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full opacity-[0.08] animate-blob" style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
                <div className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] rounded-full opacity-[0.06] animate-blob animation-delay-2000" style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
                <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full opacity-[0.04] animate-blob animation-delay-4000" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />

                <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-6 md:pt-20 md:pb-10 lg:pt-16 lg:pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">

                        {/* ── Left Column ── */}
                        <div className="flex flex-col justify-center animate-fade-in-up order-2 lg:order-1">

                            {/* Badge pill — glassmorphism */}
                            <div
                                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-7 w-fit animate-fade-in border border-emerald-200/60"
                                style={{
                                    background: 'rgba(255,255,255,0.55)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                }}
                            >
                                <span className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span className="text-[13px] font-semibold text-emerald-800 tracking-wide">{displayBadgeText}</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-[2.5rem] sm:text-5xl md:text-[3.5rem] lg:text-[3.75rem] font-extrabold text-gray-900 leading-[1.08] mb-5 tracking-[-0.02em]">
                                {titleBefore && (
                                    <span>{titleBefore}</span>
                                )}
                                {highlightWord && (
                                    <>
                                        <br />
                                        <span className="text-gray-900">for </span>
                                        <span
                                            className="bg-clip-text text-transparent"
                                            style={{ backgroundImage: 'linear-gradient(135deg, #059669, #10b981, #047857)' }}
                                        >
                                            {highlightWord}
                                        </span>
                                    </>
                                )}
                            </h1>

                            {/* Description */}
                            <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed mb-9 max-w-[440px]">
                                {displayDesc}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-10">
                                <Link
                                    href="/products"
                                    className="group relative px-8 py-3.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white rounded-full font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {displayCTA}
                                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>
                                <Link
                                    href="/products"
                                    className="group text-emerald-700 font-semibold text-sm flex items-center gap-1.5 hover:text-emerald-900 transition-colors"
                                >
                                    View All Products
                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Rating / trust row */}
                            <div className="flex items-center gap-4 animate-fade-in animate-delay-300">
                                {/* Avatar stack */}
                                <div className="flex -space-x-2.5">
                                    {[
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face",
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
                                    ].map((src, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full border-[2.5px] border-white overflow-hidden relative shadow-sm"
                                        >
                                            <Image src={src} alt="Customer" fill className="object-cover" sizes="40px" />
                                        </div>
                                    ))}
                                    {/* "+X more" circle */}
                                    <div className="w-10 h-10 rounded-full border-[2.5px] border-white bg-emerald-50 flex items-center justify-center shadow-sm">
                                        <span className="text-[11px] font-bold text-emerald-700">+9k</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
                                        {/* Star icon */}
                                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <p className="text-sm font-extrabold text-gray-900">{displayRating}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">{displayTrustText}</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Right Column — Hero Image ── */}
                        <div className="relative flex items-end justify-center order-1 lg:order-2 animate-fade-in animate-delay-200">
                            {/* Glow behind image */}
                            <div
                                className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full blur-3xl opacity-20"
                                style={{ background: 'radial-gradient(circle, #c3d334ff, transparent)' }}
                            />

                            <div className="relative w-full max-w-[420px] md:max-w-[500px] lg:max-w-[540px] aspect-square perspective-2000">
                                <div className="relative w-full h-full preserve-3d">
                                    <GroceryHeroCharacter />
                                </div>
                                {/* Gradient overlay at bottom of image - adjusted for illustration style */}
                                <div className="absolute inset-x-0 bottom-[-20px] h-1/3 rounded-full opacity-40 blur-2xl" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
                            </div>

                            {/* Floating stat card — top right */}
                            <div
                                className="absolute top-8 right-0 md:right-4 lg:right-0 rounded-2xl px-4 py-3 shadow-xl border border-white/60 animate-bounce-slow hidden sm:flex items-center gap-3"
                                style={{
                                    background: 'rgba(255,255,255,0.75)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                }}
                            >
                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">100% Organic</p>
                                    <p className="text-[10px] text-gray-400">Certified Fresh</p>
                                </div>
                            </div>

                            {/* Floating stat card — bottom left */}
                            <div
                                className="absolute bottom-16 left-0 md:left-4 lg:left-[-20px] rounded-2xl px-4 py-3 shadow-xl border border-white/60 animate-bounce-slow animation-delay-2000 hidden sm:flex items-center gap-3"
                                style={{
                                    background: 'rgba(255,255,255,0.75)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                }}
                            >
                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Fast Delivery</p>
                                    <p className="text-[10px] text-gray-400">Same day in Sylhet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Categories strip ─── */}
                <div className="border-t border-emerald-100/60 py-12 text-center" style={{ background: 'linear-gradient(180deg, rgba(240,253,244,0.5), rgba(255,255,255,1))' }}>
                    <p className="text-[11px] font-semibold text-emerald-600/60 uppercase tracking-[0.2em] mb-1.5">Categories</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold">
                        <span className="text-gray-900">Featured </span>
                        <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #059669, #10b981)' }}>Categories</span>
                    </h2>
                </div>
            </section>
        </>
    );
}