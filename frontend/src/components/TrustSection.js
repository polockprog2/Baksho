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


            </div>
        </section>
    );
}
