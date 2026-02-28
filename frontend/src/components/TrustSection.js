"use client";

import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * TrustSection Component - Jamoona Style
 * Social proof section with customer stats and testimonials
 */
export default function TrustSection() {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const stats = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            number: '130k+',
            label: t.happy_customers,
            color: 'text-green-600'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            number: '1,800+',
            label: t.positive_reviews,
            color: 'text-green-600'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            number: '1,500+',
            label: t.products_stock,
            color: 'text-green-600'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
            ),
            number: 'FREE',
            label: t.free_delivery_over,
            color: 'text-green-600'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah M.',
            rating: 5,
            text: t.testimonial_1,
            location: t.berlin
        },
        {
            name: 'Raj P.',
            rating: 5,
            text: t.testimonial_2,
            location: t.munich
        },
        {
            name: 'Lisa K.',
            rating: 5,
            text: t.testimonial_3,
            location: t.frankfurt
        }
    ];

    return (
        <section className="relative py-32 overflow-hidden bg-white">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-green-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-28">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-10 text-center border border-gray-100 hover:border-green-300 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className={`relative z-10 flex justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ${stat.color}`}>{stat.icon}</div>
                            <div className="relative z-10 text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                            <div className="relative z-10 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</div>

                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                        </div>
                    ))}
                </div>

                {/* Testimonials Section */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest shadow-sm">
                        ⭐ Top Rated Experience
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                        {t.what_customers_say}
                    </h2>
                    <div className="flex justify-center">
                        <div className="h-1.5 w-32 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full shadow-lg shadow-green-500/20"></div>
                    </div>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">{t.trusted_families}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-gray-100 hover:border-emerald-200 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 group relative overflow-hidden"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Star Rating */}
                            <div className="flex gap-1.5 mb-8 transform group-hover:-translate-y-1 transition-transform">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <div className="relative mb-10">
                                <span className="absolute -top-10 -left-6 text-9xl text-green-100/60 font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10">"</span>
                                <p className="text-gray-600 font-semibold leading-relaxed text-lg relative z-10 italic">
                                    {testimonial.text}
                                </p>
                            </div>

                            {/* Customer Info */}
                            <div className="flex items-center gap-5 border-t border-gray-50 pt-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center text-green-600 font-black text-xl shadow-inner group-hover:from-green-600 group-hover:to-emerald-700 group-hover:text-white group-hover:rotate-[360deg] transition-all duration-700 shadow-sm border border-green-100/50">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <div className="font-black text-gray-900 text-base">{testimonial.name}</div>
                                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full">{testimonial.location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
