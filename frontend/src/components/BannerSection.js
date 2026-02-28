import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useBanners } from '@/context/BannerContext';

/**
 * BannerSection Component
 * Displays active promotional banners in a smooth side-transition slider
 */
export default function BannerSection() {
    const { getActiveBanners, isLoaded } = useBanners();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // We compute activeBanners safely
    const activeBanners = isLoaded ? getActiveBanners() : [];

    const nextSlide = () => {
        if (activeBanners.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
        }
    };

    const prevSlide = () => {
        if (activeBanners.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + activeBanners.length) % activeBanners.length);
        }
    };

    // Auto-play logic - we keep this hook called EVERY render
    useEffect(() => {
        if (!isLoaded || isHovered || activeBanners.length <= 1) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isHovered, activeBanners.length, isLoaded]); // added isLoaded to dependencies for safety

    // Early returns only AFTER all hooks are defined
    if (!isLoaded) return null;
    if (activeBanners.length === 0) return null;

    return (
        <section className="py-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>

                {/* Main Slider Container */}
                <div className="relative h-64 md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                    <div
                        className="flex transition-transform duration-1000 ease-out h-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {activeBanners.map((banner) => (
                            <div key={banner.id} className="min-w-full h-full relative">
                                <Link href={banner.link} className="block w-full h-full relative">
                                    {/* Background Image */}
                                    <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Premium Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center max-w-2xl">
                                        <div className="mb-4">
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                </span>
                                                {banner.type === 'weekly-sale' ? 'Weekly Sale' : 'Featured Ad'}
                                            </span>
                                        </div>
                                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter drop-shadow-2xl">
                                            {banner.title}
                                        </h2>
                                        <p className="text-lg md:text-2xl text-gray-100 font-semibold mb-10 line-clamp-2 md:line-clamp-none drop-shadow-lg leading-relaxed">
                                            {banner.subtitle}
                                        </p>

                                        <div className="flex items-center">
                                            <span className="group/btn relative px-10 py-4 bg-white text-[#003B4A] rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden">
                                                <span className="relative z-10">Shop Now</span>
                                                <div className="absolute inset-0 bg-green-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                                                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 z-20 font-black">Shop Now</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {activeBanners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40 hover:scale-110 z-20"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/40 hover:scale-110 z-20"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Indicators */}
                    {activeBanners.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                            {activeBanners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 transition-all duration-500 rounded-full ${currentIndex === index ? 'w-12 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Decorative Elements (Glassmorphic) */}
                <div className="absolute -left-4 top-1/4 w-24 h-48 bg-green-500/10 backdrop-blur-xl rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -right-4 bottom-1/4 w-24 h-48 bg-blue-500/10 backdrop-blur-xl rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
        </section>
    );
}
