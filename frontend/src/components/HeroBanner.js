"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * HeroBanner Component - Baksho Style
 * Large hero banner with featured product/sale and CTA button
 */
export default function HeroBanner({ content }) {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const displayTitle = content?.hero_title || t.hero_title;
    const displayDesc = content?.hero_desc || t.hero_desc;
    const displayCTA = content?.hero_cta || t.shop_now;

    return (
        <section className="relative bg-[#f8fafc] overflow-hidden">
            {/* Dynamic Mesh Backgrounds */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-green-50/40 -skew-x-12 transform origin-top-right transition-all duration-1000 blur-3xl rounded-full translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50/30 skew-x-12 transform origin-bottom-left blur-3xl rounded-full -translate-x-1/4 translate-y-1/4"></div>

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-green-50 px-5 py-2.5 rounded-2xl text-[10px] font-black text-green-700 mb-8 border border-green-100 shadow-sm uppercase tracking-widest animate-bounce-slow">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            {t.cat_weekly_deals}
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-[#003B4A] mb-8 leading-[0.95] tracking-tighter drop-shadow-sm">
                            {displayTitle.split(' ').map((word, i) => (
                                <span key={i} className="inline-block hover:text-green-600 transition-colors duration-300">
                                    {word}{' '}
                                </span>
                            ))}
                            <span className="text-green-600 animate-pulse">.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
                            {displayDesc}
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <Link
                                href="/products"
                                className="group relative px-12 py-5 bg-green-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-green-200/50 hover:bg-green-700 transition-all transform hover:-translate-y-2 active:scale-95 overflow-hidden"
                            >
                                <span className="relative z-10 uppercase tracking-widest">{displayCTA}</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </Link>
                            <Link
                                href="/categories"
                                className="px-12 py-5 bg-white text-[#003B4A] border-2 border-gray-100 rounded-2xl font-black text-lg hover:border-green-600 hover:text-green-600 transition-all transform hover:-translate-y-2 active:scale-95 shadow-xl shadow-gray-200/20"
                            >
                                <span className="uppercase tracking-widest">{t.view_categories}</span>
                            </Link>
                        </div>

                        {/* Trust Metrics with Floating Effect */}
                        <div className="mt-16 flex items-center gap-10">
                            {[
                                { label: 'Active Users', value: '50k+', icon: '👥' },
                                { label: 'Fresh Products', value: '10k+', icon: '🥗' }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${500 + i * 100}ms` }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg opacity-80">{stat.icon}</span>
                                        <span className="text-3xl font-black text-[#003B4A] tracking-tighter">{stat.value}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image Section - More Dynamic */}
                    <div className="relative group perspective-1000">
                        <div className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] z-20 group-hover:rotate-1 transition-transform duration-1000">
                            <Image
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200"
                                alt="Fresh Groceries"
                                fill
                                priority
                                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[3s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#003B4A]/40 via-transparent to-white/10 group-hover:opacity-0 transition-opacity duration-1000"></div>
                        </div>

                        {/* Premium Floating Status Cards */}
                        <div className="absolute -top-10 -right-10 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl z-30 flex items-center gap-4 animate-bounce-slow border border-white/50 border-t-white">
                            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Top Rated</p>
                                <p className="text-xl font-black text-[#003B4A] leading-tight">4.9/5.0 Store</p>
                            </div>
                        </div>

                        <div className="absolute -bottom-12 -left-12 bg-white p-8 rounded-[2.5rem] shadow-2xl z-30 flex items-center gap-5 animate-pulse-slow border border-gray-50">
                            <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-green-200">
                                %
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">Member Deals</p>
                                <p className="text-2xl font-black text-gray-900 leading-tight tracking-tighter">Up to 45% OFF</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
