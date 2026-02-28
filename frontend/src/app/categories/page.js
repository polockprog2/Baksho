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

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[#003B4A] mb-4 uppercase tracking-tight">{t.shop_by_category}</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        {t.categories_desc}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>

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
