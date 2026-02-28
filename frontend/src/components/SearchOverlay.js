"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchProducts as searchProductsUtil } from '@/utils/helpers';
import { getProducts } from '@/api/product.api';
import { formatPrice } from '@/utils/helpers';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * SearchOverlay Component
 * A premium command-palette style search interface
 */
export default function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const inputRef = useRef(null);
    const overlayRef = useRef(null);
    const [mounted, setMounted] = React.useState(false);

    // Handle mount state for hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen && mounted) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            if (mounted) {
                setQuery('');
                setResults([]);
                setIsLoading(false);
            }
        }
    }, [isOpen, mounted]);

    // Handle search logic
    useEffect(() => {
        const performSearch = async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                try {
                    const response = await getProducts({ search: query, limit: 8 });
                    setResults(response.data || response);
                } catch (error) {
                    console.error('Search failed:', error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        };

        const debounce = setTimeout(performSearch, 400);
        return () => clearTimeout(debounce);
    }, [query]);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleBackdropClick = (e) => {
        if (overlayRef.current && !overlayRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!mounted || !isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[110] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-md animate-fade-in"
            onMouseDown={handleBackdropClick}
        >
            <div
                ref={overlayRef}
                className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-in"
            >
                {/* Search Input Area */}
                <div className="p-8 border-b border-gray-100 flex items-center gap-6">
                    <div className="text-3xl flex items-center justify-center w-10">
                        {isLoading ? (
                            <div className="w-8 h-8 border-4 border-[#003B4A]/10 border-t-[#003B4A] rounded-full animate-spin"></div>
                        ) : (
                            <span className="animate-pulse">🔍</span>
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t.search_placeholder}
                        className="w-full bg-transparent text-2xl font-black text-[#003B4A] placeholder-gray-300 focus:outline-none tracking-tighter"
                    />
                    <button
                        onClick={onClose}
                        className="px-3 py-1 rounded-lg bg-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        ESC
                    </button>
                </div>

                {/* Search Results Area */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {query.trim().length > 0 ? (
                        results.length > 0 ? (
                            <div className="p-4 grid grid-cols-1 gap-2">
                                <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {t.search_suggestions}
                                </div>
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-4 rounded-3xl hover:bg-[#F9F7F2] transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#003B4A] group-hover:text-green-600 transition-colors">{product.name}</h4>
                                            <p className="text-xs text-gray-400">{product.category} • {product.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[#003B4A]">{formatPrice(product.price)}</p>
                                            <div className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block">
                                                In Stock
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <div className="p-4 border-t border-gray-50 text-center">
                                    <Link
                                        href={`/products?search=${query}`}
                                        onClick={onClose}
                                        className="text-xs font-black text-[#003B4A] uppercase tracking-widest hover:text-green-600 transition-colors"
                                    >
                                        {t.search_view_all} "{query}"
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="text-6xl mb-6">🏜️</div>
                                <h3 className="text-xl font-bold text-[#003B4A] mb-2">{t.search_no_results}</h3>
                                <p className="text-gray-400">{t.search_no_results_desc}</p>
                            </div>
                        )
                    ) : (
                        <div className="p-12">
                            <div className="px-4 mb-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {t.search_popular_cats}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Pantry'].map(cat => (
                                    <Link
                                        key={cat}
                                        href={`/products?category=${cat.toLowerCase()}`}
                                        onClick={onClose}
                                        className="p-6 rounded-3xl bg-gray-50 hover:bg-green-50 hover:text-green-600 font-bold text-gray-500 text-center transition-all border border-transparent hover:border-green-100"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Shortcuts */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center px-8">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                            <kbd className="bg-white border border-gray-100 px-1.5 py-0.5 rounded shadow-sm text-gray-600 font-black">↑↓</kbd> {t.search_shortcut_nav}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                            <kbd className="bg-white border border-gray-100 px-1.5 py-0.5 rounded shadow-sm text-gray-600 font-black">⏎</kbd> {t.search_shortcut_select}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest tracking-widest">{t.search_powered_by}</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
