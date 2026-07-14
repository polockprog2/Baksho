"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { subscribeNewsletter } from '@/api/user.api';

/**
 * Footer Component - Jamoona Style
 * Features: About Us & FAQ, Top Categories, Language selector, Newsletter signup
 */
export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { language, changeLanguage } = useLanguage();
    const t = translations[language] || translations.EN;
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('idle');
    const [newsletterMessage, setNewsletterMessage] = useState('');

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        setNewsletterStatus('loading');
        setNewsletterMessage('');

        try {
            const data = await subscribeNewsletter(email.trim());
            setNewsletterStatus('success');
            setNewsletterMessage(data.message || t.newsletter_success || 'Thank you for subscribing!');
            setEmail('');
        } catch (error) {
            setNewsletterStatus('error');
            setNewsletterMessage(error.message || 'Subscription failed. Please try again.');
        }
    };

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl md:text-3xl">📦</span>
                            <span className="text-xl md:text-2xl font-bold text-green-400">Baksho®</span>
                        </div>
                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                            {t.footer_desc}
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors" aria-label="Twitter">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* About Us, Help & FAQ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-400">{t.footer_help_title}</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.about_us}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.faq}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.shipping_info}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.contact_us}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.privacy_policy}</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t.terms}</a></li>
                        </ul>
                    </div>

                    {/* Top Categories */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-400">{t.footer_categories_title}</h3>
                        <ul className="space-y-2">
                            <li><Link href="/products?category=value-deals" className="text-gray-400 hover:text-white transition-colors">{t.cat_value_deals.replace('!', '')}</Link></li>
                            <li><Link href="/products?category=staples" className="text-gray-400 hover:text-white transition-colors">{t.nav_sub_basmati}</Link></li>
                            <li><Link href="/products?category=vegetables" className="text-gray-400 hover:text-white transition-colors">{t.nav_cat_fruits_veg}</Link></li>
                            <li><Link href="/products?category=fruits" className="text-gray-400 hover:text-white transition-colors">{language === 'BN' ? 'ফলমূল' : language === 'DE' ? 'Früchte' : 'Fruits'}</Link></li>
                            <li><Link href="/products?category=essentials" className="text-gray-400 hover:text-white transition-colors">{t.nav_sub_spices}</Link></li>
                            <li><Link href="/products?category=essentials" className="text-gray-400 hover:text-white transition-colors">{t.nav_sub_ready_to_eat}</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Language */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-green-400">{t.footer_connect_title}</h3>
                        <p className="text-gray-400 mb-4 text-xs">
                            {t.newsletter_desc}
                        </p>
                        <form onSubmit={handleNewsletterSubmit} className="mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.newsletter_placeholder}
                                    required
                                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 text-sm focus:border-green-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterStatus === 'loading'}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                                >
                                    {newsletterStatus === 'loading' ? '...' : '→'}
                                </button>
                            </div>
                            {newsletterMessage && (
                                <p className={`mt-2 text-xs font-medium ${newsletterStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                    {newsletterMessage}
                                </p>
                            )}
                        </form>

                        {/* Language Selector */}
                        <div>
                            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-black">{t.language_label}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => changeLanguage('EN')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-bold ${language === 'EN' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    <span>🇬🇧</span> EN
                                </button>
                                <button
                                    onClick={() => changeLanguage('BN')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-bold ${language === 'BN' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    <span>🇧🇩</span> বাংলা
                                </button>
                                <button
                                    onClick={() => changeLanguage('DE')}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-xs font-bold ${language === 'DE' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    <span>🇩🇪</span> DE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
                    <p>&copy; {currentYear} 📦Baksho®. {t.all_rights_reserved} | {t.made_with} {t.germany}</p>
                </div>
            </div>
        </footer>
    );
}
