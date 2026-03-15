"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CategoryCard from '@/components/CategoryCard';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function CategoriesPage() {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data || data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[#003B4A] mb-4 uppercase tracking-tight">{t.shop_by_category}</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium mb-8">
                        {t.categories_desc}
                    </p>
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#003B4A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 focus:border-[#003B4A] sm:text-sm shadow-sm transition-all"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-gray-200 animate-pulse rounded-2xl border border-gray-100 shadow-sm"></div>
                        ))}
                    </div>
                ) : filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-20 animate-fade-in-up">
                        {filteredCategories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mb-20 py-16 bg-white flex flex-col items-center rounded-3xl border border-gray-100 shadow-sm">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-black text-[#003B4A] mb-3">No categories found</h3>
                        <p className="text-gray-500 max-w-sm">We couldn't find any category matching "{searchQuery}"</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-8 px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-full font-bold uppercase tracking-wide hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* CTA Section */}
                <div className="bg-gradient-to-br from-[#003B4A] via-[#005F73] to-[#0A9396] text-white rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-[#003B4A]/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-wider">{t.cant_find}</h2>
                        <p className="text-xl mb-10 text-teal-100 font-medium max-w-2xl mx-auto">
                            {t.browse_all_products}
                        </p>
                        <Link href="/products" className="inline-block bg-white text-[#003B4A] px-12 py-4 rounded-full font-black text-lg uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
                            {t.view_all_products}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
