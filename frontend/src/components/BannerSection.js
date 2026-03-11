"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useBanners } from '@/context/BannerContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * BannerSection Component - Premium Overhaul
 * Displays active promotional banners with cinematic animations and refined visuals.
 */
export default function BannerSection() {
    const { getActiveBanners, isLoaded } = useBanners();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    // We compute activeBanners safely
    const activeBanners = isLoaded ? getActiveBanners() : [];

    const handleSlideChange = (newIndex) => {
        if (isChanging) return;
        setIsChanging(true);
        setCurrentIndex(newIndex);
        setTimeout(() => setIsChanging(false), 1000); // Matches transition duration
    };

    const nextSlide = () => {
        if (activeBanners.length > 1) {
            handleSlideChange((currentIndex + 1) % activeBanners.length);
        }
    };

    const prevSlide = () => {
        if (activeBanners.length > 1) {
            handleSlideChange((currentIndex - 1 + activeBanners.length) % activeBanners.length);
        }
    };

    // Auto-play logic
    useEffect(() => {
        if (!isLoaded || isHovered || activeBanners.length <= 1) return;
        const interval = setInterval(nextSlide, 6000); // slightly slower for premium feel
        return () => clearInterval(interval);
    }, [isHovered, activeBanners.length, isLoaded, currentIndex]);

    if (!isLoaded) return null;
    if (activeBanners.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>

                {/* Main Slider Container */}
                <div className="relative h-[480px] md:h-[550px] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-2 border-gray-50 bg-gray-900">
                    <div
                        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {activeBanners.map((banner, idx) => (
                            <div key={banner.id} className="min-w-full h-full relative overflow-hidden">
                                <Link href={banner.link} className="block w-full h-full relative">
                                    {/* Background Image with Parallax-esque breathing effect */}
                                    <div className={`relative w-full h-full transition-transform duration-[8s] ease-linear ${currentIndex === idx ? 'scale-110' : 'scale-100'}`}>
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            fill
                                            className="object-cover opacity-90"
                                            priority={idx === 0}
                                        />
                                    </div>

                                    {/* Premium Cinematic Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

                                    {/* Content Overlay */}
                                    <div className={`absolute inset-0 p-10 md:p-24 flex flex-col justify-center max-w-3xl z-20 transition-all duration-1000 ${currentIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                                        <div className="mb-8">
                                            <span className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-xl text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl border border-white/20 shadow-2xl">
                                                <span className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                                                </span>
                                                {banner.type === 'weekly-sale' ? t.weekly_special : t.featured_offer}
                                            </span>
                                        </div>

                                        <h2 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
                                            {banner.title.split(' ').map((word, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block mr-4 transform transition-all duration-700"
                                                    style={{ transitionDelay: `${400 + i * 100}ms` }}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </h2>

                                        <p className="text-xl md:text-2xl text-gray-200 font-medium mb-12 max-w-xl leading-relaxed drop-shadow-lg transition-all duration-700 delay-[800ms]">
                                            {banner.subtitle}
                                        </p>

                                        <div className="flex items-center transition-all duration-700 delay-[1000ms]">
                                            <span className="group/btn relative px-14 py-5 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-green-900/40 hover:bg-green-500 transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden">
                                                <span className="relative z-10">{t.shop_now}</span>
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Premium Navigation */}
                    {activeBanners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 z-30 shadow-2xl"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 z-30 shadow-2xl"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Expressive Indicators */}
                    {activeBanners.length > 1 && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 bg-black/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                            {activeBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSlideChange(index)}
                                    className={`h-1.5 transition-all duration-700 rounded-full ${currentIndex === index ? 'w-12 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'w-3 bg-white/40 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Background Decorative Energy */}
                <div className="absolute -left-20 top-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <style jsx>{`
                .cubic-bezier {
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </section>
    );
}
