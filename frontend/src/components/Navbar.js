"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchBar from './SearchBar';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';
import { translations } from '@/data/translations';

/**
 * Navbar Component - Jamoona Reference Style
 */
export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { language, changeLanguage } = useLanguage();
    const t = translations[language] || translations.EN;
    const { getCartCount, toggleCart } = useCart();
    const { user, logout, isAdmin } = useUser();
    const { getWishlistCount } = useWishlist();
    // const { openSearch } = useUI(); // Removed unused openSearch

    const categories = [
        {
            name: t.nav_cat_staples,
            slug: 'staples',
            hasDropdown: true,
            subcategories: [
                { name: t.nav_sub_basmati, slug: 'basmati-rice' },
                { name: t.nav_sub_grains, slug: 'grains-pulses' },
                { name: t.nav_sub_atta, slug: 'atta-flours' },
                { name: t.nav_sub_oils, slug: 'oils-ghee' }
            ]
        },
        {
            name: t.nav_cat_essentials,
            slug: 'essentials',
            hasDropdown: true,
            subcategories: [
                { name: t.nav_sub_spices, slug: 'spices-herbs' },
                { name: t.nav_sub_sauces, slug: 'sauces-pastes' },
                { name: t.nav_sub_ready_to_eat, slug: 'ready-to-eat' },
                { name: t.nav_sub_snacks, slug: 'snacks' }
            ]
        },
        { name: t.nav_cat_fruits_veg, slug: 'vegetables' },
        {
            name: t.nav_cat_fresh_frozen,
            slug: 'frozen',
            hasDropdown: true,
            subcategories: [
                { name: t.nav_sub_dairy, slug: 'dairy-eggs' },
                { name: t.nav_sub_paneer, slug: 'paneer-tofu' },
                { name: t.nav_sub_frozen_meals, slug: 'frozen-meals' },
                { name: t.nav_sub_meat, slug: 'meat-poultry' }
            ]
        },
        { name: t.nav_cat_bestsellers, slug: 'featured' },
        { name: t.nav_cat_save_food, slug: 'save-food' },
        {
            name: t.nav_cat_home_new,
            slug: 'new-arrivals',
            hasDropdown: true,
            subcategories: [
                { name: t.nav_sub_incense, slug: 'incense-puja' },
                { name: t.nav_sub_personal_care, slug: 'personal-care' },
                { name: t.nav_sub_cookware, slug: 'cookware' }
            ]
        },
    ];

    return (
        <header className="w-full z-50 bg-white">
            {/* Row 1: Announcement Bar (Optimized for Mobile) */}
            <div className="bg-[#F9F7F2] border-b border-gray-100 py-1.5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-8 text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] whitespace-nowrap animate-scroll-mobile md:animate-none md:justify-between md:flex-wrap">
                        {/* Items Group 1 */}
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">📦</span> {t.announcement_shipping}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">🏅</span> {t.announcement_startup}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">💚</span> {t.announcement_customers}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">🍛</span> {t.announcement_about}
                                <Link href="/about" className="hover:text-[#003B4A] transition-colors ml-1 border-b border-[#003B4A]/30">→ {t.about_us}</Link>
                            </div>
                        </div>
                        {/* Items Group 2 (For seamless loop on mobile) */}
                        <div className="flex md:hidden items-center gap-8">
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">📦</span> {t.announcement_shipping}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">🏅</span> {t.announcement_startup}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">💚</span> {t.announcement_customers}
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-sm">🍛</span> {t.announcement_about}
                                <Link href="/about" className="hover:text-[#003B4A] transition-colors ml-1 border-b border-[#003B4A]/30">→ {t.about_us}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Main Bar */}
            <div className="bg-white py-4 border-b border-gray-100 sticky top-0 md:relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
                    {/* Logo (Animated Style) */}
                    <div className="flex items-center">
                        <Link href="/" className="logo-animated">
                            <span>📦Baksho®</span>
                            <span>📦Baksho®</span>
                            <span>Find Your Need®</span>
                        </Link>
                    </div>
                    {/* Desktop Search Bar */}
                    <div className="hidden md:block flex-1 max-w-2xl px-4">
                        <SearchBar />
                    </div>

                    {/* Icons Section */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Language Switcher */}
                        {/* Language Switcher - Hide text on mobile */}
                        <div className="relative group">
                            <div className="flex items-center gap-1 text-sm font-bold text-[#003B4A] cursor-pointer hover:opacity-80 transition-opacity">
                                <span className="text-xl">
                                    {language === 'EN' ? '🇬🇧' : language === 'BN' ? '🇧🇩' : '🇩🇪'}
                                </span>
                                <span className="hidden md:inline uppercase text-xs">{language}</span>
                                <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Dropdown */}
                            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl py-2 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                                <button
                                    onClick={() => changeLanguage('EN')}
                                    className={`w-full text-left px-4 py-2 hover:bg-[#F9F7F2] flex items-center gap-2 text-xs font-bold ${language === 'EN' ? 'text-[#003B4A]' : 'text-gray-500'}`}
                                >
                                    <span>🇬🇧</span> ENGLISH
                                </button>
                                <button
                                    onClick={() => changeLanguage('BN')}
                                    className={`w-full text-left px-4 py-2 hover:bg-[#F9F7F2] flex items-center gap-2 text-xs font-bold ${language === 'BN' ? 'text-[#003B4A]' : 'text-gray-500'}`}
                                >
                                    <span>🇧🇩</span> বাংলা
                                </button>
                                <button
                                    onClick={() => changeLanguage('DE')}
                                    className={`w-full text-left px-4 py-2 hover:bg-[#F9F7F2] flex items-center gap-2 text-xs font-bold ${language === 'DE' ? 'text-[#003B4A]' : 'text-gray-500'}`}
                                >
                                    <span>🇩🇪</span> DEUTSCH
                                </button>
                            </div>
                        </div>

                        {/* Wishlist - Hide on extra small */}
                        <Link href="/wishlist" className="relative p-1 hover:opacity-70 transition-opacity hidden sm:block" aria-label="Wishlist">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {getWishlistCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full border border-white">
                                    {getWishlistCount()}
                                </span>
                            )}
                        </Link>

                        {/* Profile - Hide text on mobile */}
                        <Link href="/profile" className="p-1 hover:opacity-70 transition-opacity">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-700 hover:text-green-600 transition-colors group"
                            aria-label="Toggle Cart"
                        >
                            <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-green-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg transition-colors">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                                        {user.name ? user.name[0] : 'U'}
                                    </div>
                                    <span className="hidden lg:block font-medium text-gray-700">{user.name || 'User'}</span>
                                </button>

                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-sm shadow-xl border border-emerald-200 py-2 opacity-10 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link href="/profile" className="block px-4 py-2 hover:bg-green-50 transition-colors text-gray-700">
                                        My Profile
                                    </Link>
                                    <Link href="/profile#orders" className="block px-4 py-2 hover:bg-green-50 transition-colors text-gray-700">
                                        My Orders
                                    </Link>
                                    {isAdmin() && (
                                        <Link href="/admin" className="block px-4 py-2 hover:bg-green-50 transition-colors text-green-600 font-medium">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <hr className="my-2" />
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-1 text-gray-800"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar - Enhanced Layout */}
                <div className="md:hidden px-4 pb-4 pt-1">
                    <div className="bg-[#F9F7F2] p-2 rounded-2xl shadow-inner border border-gray-50">
                        <SearchBar />
                    </div>
                </div>
            </div>

            {/* Row 3: Category Nav (Desktop only) */}
            <div className="hidden md:block bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 h-12">
                    {/* ! VALUE DEALS (Teal Badge) */}
                    <Link
                        href="/deals/value"
                        className="bg-[#003B4A] text-white px-4 py-1.5 rounded-full text-xs font-black italic tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        ! VALUE DEALS
                    </Link>

                    {/* WEEKLY DEALS (Red Badge) */}
                    <Link
                        href="/deals/weekly"
                        className="bg-[#BF4136] text-white px-4 py-1.5 rounded-full text-xs font-black italic tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                        WEEKLY DEALS
                    </Link>

                    {/* Other Categories */}
                    <div className="flex items-center gap-6 h-full">
                        {categories.map((cat) => (
                            <div key={cat.name} className="relative group h-full flex items-center">
                                <Link
                                    href={`/products?category=${cat.slug}`}
                                    className="text-[12px] font-black text-[#003B4A] hover:opacity-70 transition-opacity whitespace-nowrap flex items-center gap-1"
                                >
                                    {cat.name}
                                    {cat.hasDropdown && (
                                        <svg className="w-3 h-3 text-[#003B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                {cat.hasDropdown && (
                                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
                                        <div className="bg-white shadow-xl border border-gray-100 rounded-lg py-3 w-56">
                                            {cat.subcategories?.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={`/products?category=${sub.slug}`}
                                                    className="block px-4 py-2 text-xs font-bold text-gray-600 hover:text-[#003B4A] hover:bg-[#F9F7F2] transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay (Refined) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/60 z-[70] md:hidden backdrop-blur-sm transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="absolute left-0 top-0 w-[85%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-left"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Sidebar Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#F9F7F2]">
                            <div className="logo-animated scale-[0.65] origin-left">
                                <span>📦Baksho®</span>
                                <span>📦Baksho®</span>
                                <span>Find Your Need®</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto py-6 px-6">
                            <div className="space-y-6">
                                {/* Special Sections */}
                                <div className="space-y-3">
                                    <Link
                                        href="/deals/value"
                                        className="flex items-center gap-3 p-4 bg-[#003B4A] text-white rounded-2xl font-black italic shadow-lg active:scale-95 transition-all text-sm"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="text-xl">💰</span> ! VALUE DEALS
                                    </Link>
                                    <Link
                                        href="/deals/weekly"
                                        className="flex items-center gap-3 p-4 bg-[#BF4136] text-white rounded-2xl font-black italic shadow-lg active:scale-95 transition-all text-sm"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="text-xl">🔥</span> WEEKLY DEALS
                                    </Link>
                                </div>

                                {/* Main Categories */}
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Shop by Category</p>
                                    {categories.map(cat => (
                                        <div key={cat.name} className="border-b border-gray-50 last:border-0">
                                            <Link
                                                href={`/products?category=${cat.slug}`}
                                                className="flex items-center justify-between py-4 group"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span className="font-bold text-gray-700 group-hover:text-[#003B4A] transition-colors">{cat.name}</span>
                                                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#003B4A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Footer */}
                        <div className="p-6 border-t border-gray-100 bg-[#F9F7F2]">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 text-gray-600 font-bold text-sm mb-4"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    👤
                                </div>
                                My Account
                            </Link>
                            <div className="flex gap-4">
                                <button className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 shadow-sm" onClick={() => changeLanguage('EN')}>EN</button>
                                <button className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-600 shadow-sm" onClick={() => changeLanguage('BN')}>BN</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
