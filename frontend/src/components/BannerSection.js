"use client";

import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useBanners } from '@/context/BannerContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

const AUTOPLAY_DURATION = 7000; // ms per slide

/**
 * BannerSection Component - Premium Cinematic Overhaul
 * Crossfade transitions, progress bar, touch support, editorial counter.
 */
export default function BannerSection() {
    const { getActiveBanners, isLoaded } = useBanners();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [progress, setProgress] = useState(0);

    // Touch / swipe
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const progressRef = useRef(null);

    const activeBanners = isLoaded ? getActiveBanners() : [];

    const goToSlide = useCallback((newIndex) => {
        if (newIndex === currentIndex) return;
        setPrevIndex(currentIndex);
        setCurrentIndex(newIndex);
        setProgress(0);
    }, [currentIndex]);

    const nextSlide = useCallback(() => {
        if (activeBanners.length > 1) {
            goToSlide((currentIndex + 1) % activeBanners.length);
        }
    }, [activeBanners.length, currentIndex, goToSlide]);

    const prevSlide = useCallback(() => {
        if (activeBanners.length > 1) {
            goToSlide((currentIndex - 1 + activeBanners.length) % activeBanners.length);
        }
    }, [activeBanners.length, currentIndex, goToSlide]);

    // Clear prevIndex after crossfade completes
    useEffect(() => {
        if (prevIndex === null) return;
        const timer = setTimeout(() => setPrevIndex(null), 1100);
        return () => clearTimeout(timer);
    }, [prevIndex]);

    // Auto-play with progress bar
    useEffect(() => {
        if (!isLoaded || isHovered || activeBanners.length <= 1) return;

        const startTime = Date.now();
        const tick = () => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);
            setProgress(pct);

            if (elapsed >= AUTOPLAY_DURATION) {
                nextSlide();
                return;
            }
            progressRef.current = requestAnimationFrame(tick);
        };
        progressRef.current = requestAnimationFrame(tick);

        return () => {
            if (progressRef.current) cancelAnimationFrame(progressRef.current);
        };
    }, [isHovered, activeBanners.length, isLoaded, currentIndex, nextSlide]);

    // Touch handlers
    const onTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX;
    };
    const onTouchMove = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
    };
    const onTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;
        if (diff > threshold) nextSlide();
        else if (diff < -threshold) prevSlide();
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Keyboard navigation
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        if (isHovered) {
            window.addEventListener('keydown', handler);
            return () => window.removeEventListener('keydown', handler);
        }
    }, [isHovered, nextSlide, prevSlide]);

    if (!isLoaded) return null;
    if (activeBanners.length === 0) return null;

    return (
        <section className="py-12 md:py-20 bg-white overflow-hidden">
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* Main Slider Container */}
                <div
                    className="relative h-[420px] sm:h-[480px] md:h-[560px] lg:h-[600px] rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-gray-900"
                    style={{
                        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05) inset',
                    }}
                >
                    {/* === CROSSFADE SLIDES === */}
                    {activeBanners.map((banner, idx) => {
                        const isActive = idx === currentIndex;
                        const isLeaving = idx === prevIndex;
                        const isVisible = isActive || isLeaving;

                        return (
                            <div
                                key={banner.id}
                                className="absolute inset-0"
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    zIndex: isActive ? 2 : isLeaving ? 1 : 0,
                                    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                    pointerEvents: isActive ? 'auto' : 'none',
                                }}
                                aria-hidden={!isActive}
                            >
                                <Link href={banner.link} className="block w-full h-full relative">
                                    {/* Background Image — Ken Burns effect */}
                                    <div
                                        className="absolute inset-0 transition-transform duration-[10s] ease-linear"
                                        style={{
                                            transform: isActive ? 'scale(1.08)' : 'scale(1.0)',
                                        }}
                                    >
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                            priority={idx === 0}
                                            sizes="(max-width: 768px) 100vw, 1280px"
                                        />
                                    </div>

                                    {/* Cinematic Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10 z-[3]" />
                                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent z-[3]" />

                                    {/* Film grain texture */}
                                    <div
                                        className="absolute inset-0 z-[4] opacity-[0.03] pointer-events-none mix-blend-overlay"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                                        }}
                                    />

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 z-[5] flex items-center">
                                        <div
                                            className="px-8 sm:px-12 md:px-20 lg:px-24 max-w-3xl"
                                            style={{
                                                opacity: isActive ? 1 : 0,
                                                transform: isActive ? 'translateY(0)' : 'translateY(24px)',
                                                transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                                            }}
                                        >
                                            {/* Badge */}
                                            <div className="mb-6 md:mb-8">
                                                <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-xl text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/15">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                                    </span>
                                                    {banner.type === 'weekly-sale' ? t.weekly_special : t.featured_offer}
                                                </span>
                                            </div>

                                            {/* Title — word-by-word stagger */}
                                            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 md:mb-6 leading-[0.92] tracking-tighter">
                                                {banner.title.split(' ').map((word, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-block mr-2 sm:mr-3 md:mr-4"
                                                        style={{
                                                            opacity: isActive ? 1 : 0,
                                                            transform: isActive ? 'translateY(0) rotate(0deg)' : 'translateY(40px) rotate(2deg)',
                                                            transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.08}s`,
                                                        }}
                                                    >
                                                        {word}
                                                    </span>
                                                ))}
                                            </h2>

                                            {/* Subtitle */}
                                            <p
                                                className="text-base sm:text-lg md:text-xl text-gray-200/90 font-medium mb-8 md:mb-10 max-w-lg leading-relaxed"
                                                style={{
                                                    opacity: isActive ? 1 : 0,
                                                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                                                    transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
                                                }}
                                            >
                                                {banner.subtitle}
                                            </p>

                                            {/* CTA Button */}
                                            <div
                                                style={{
                                                    opacity: isActive ? 1 : 0,
                                                    transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                                                    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s',
                                                }}
                                            >
                                                <span className="group/btn relative inline-flex items-center gap-3 px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 bg-emerald-600 text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-[0.15em] shadow-2xl shadow-emerald-900/30 hover:bg-emerald-500 transition-all duration-400 hover:scale-105 active:scale-95 overflow-hidden">
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        {t.shop_now}
                                                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </span>
                                                    <div className="absolute inset-0 bg-white/15 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}

                    {/* === BOTTOM BAR: Progress + Counter + Indicators === */}
                    {activeBanners.length > 1 && (
                        <div className="absolute bottom-0 inset-x-0 z-30">
                            {/* Progress bar */}
                            <div className="h-[3px] bg-white/10">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-none"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Bottom controls bar */}
                            <div className="flex items-center justify-between px-6 sm:px-10 md:px-16 py-4 md:py-5 bg-gradient-to-t from-black/40 to-transparent">
                                {/* Slide counter */}
                                <div className="flex items-center gap-3 text-white/70 text-xs font-mono tracking-wider select-none">
                                    <span className="text-white font-bold text-sm">
                                        {String(currentIndex + 1).padStart(2, '0')}
                                    </span>
                                    <span className="w-8 h-px bg-white/30" />
                                    <span>{String(activeBanners.length).padStart(2, '0')}</span>
                                </div>

                                {/* Dot indicators */}
                                <div className="flex items-center gap-2">
                                    {activeBanners.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => { e.preventDefault(); goToSlide(index); }}
                                            aria-label={`Go to slide ${index + 1}`}
                                            className={`transition-all duration-500 rounded-full ${
                                                currentIndex === index
                                                    ? 'w-8 h-2 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                                                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Mini nav arrows */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prevSlide}
                                        aria-label="Previous slide"
                                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        aria-label="Next slide"
                                        className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Large side navigation (desktop only, on hover) */}
                    {activeBanners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                aria-label="Previous slide"
                                className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/10 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-gray-900 hover:scale-110 z-20 shadow-2xl"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label="Next slide"
                                className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-black/20 backdrop-blur-2xl border border-white/10 text-white items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-gray-900 hover:scale-110 z-20 shadow-2xl"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Background Decorative Glow */}
                <div className="absolute -left-20 top-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />
                <div className="absolute -right-20 bottom-1/4 w-80 h-80 bg-green-500/8 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />
            </div>
        </section>
    );
}
