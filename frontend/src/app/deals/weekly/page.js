"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/api/product.api';

/**
 * Weekly Deals Page
 * Displays all products with weekly deal badges
 */
export default function WeeklyDealsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await getProducts({ limit: 100 });
                const allProducts = response.data || response;
                const deals = allProducts.filter(p => (p.discount || 0) >= 20).slice(0, 8);
                setProducts(deals);
            } catch (err) {
                console.error('Failed to fetch deals:', err);
                setError('Failed to load deals');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeals();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-5xl">🔥</span>
                        <h1 className="text-5xl md:text-6xl font-black">Weekly Deals</h1>
                    </div>
                    <p className="text-xl md:text-2xl text-red-100 max-w-2xl">
                        Limited time offers on your favorite products. Don't miss out!
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-lg font-semibold">
                        <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            ⏰ Deals refresh weekly
                        </span>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length > 0 ? (
                        <>
                            <div className="mb-8">
                                <p className="text-gray-600 text-lg">
                                    Showing <span className="font-bold text-slate-900">{products.length}</span> weekly deals
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product, index) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                                        <ProductCard product={product} badgeType="weekly-deal" />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-2xl text-gray-600 mb-6">No weekly deals available right now</p>
                            <Link href="/products" className="inline-block bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300">
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
                            <div className="text-5xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Flash Sales</h3>
                            <p className="text-gray-700">Limited quantity deals that change weekly</p>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                            <div className="text-5xl mb-4">💰</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Big Savings</h3>
                            <p className="text-gray-700">Save up to 25% on selected items</p>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
                            <div className="text-5xl mb-4">🎁</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Fresh Stock</h3>
                            <p className="text-gray-700">New deals added every Monday</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-orange-500 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">Don't Miss Out!</h2>
                    <p className="text-xl text-red-100 mb-8">Subscribe to get notified about new weekly deals</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-6 py-3 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                            Notify Me
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
