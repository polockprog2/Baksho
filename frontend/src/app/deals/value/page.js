"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/api/product.api';

/**
 * Value Deals Page
 * Displays all products with value deal badges
 */
export default function ValueDealsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await getProducts({ limit: 100 });
                const allProducts = response.data || response;
                const deals = allProducts.filter(p => (p.discount || 0) >= 10).slice(0, 8);
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
            <section className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-5xl">💰</span>
                        <h1 className="text-5xl md:text-6xl font-black">Value Deals</h1>
                    </div>
                    <p className="text-xl md:text-2xl text-amber-100 max-w-2xl">
                        Wallet-friendly prices on quality products. Get more for less!
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-lg font-semibold">
                        <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            ✓ Everyday low prices
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
                                    Showing <span className="font-bold text-slate-900">{products.length}</span> value deals
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product, index) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms` }}>
                                        <ProductCard product={product} badgeType="value-deal" />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-2xl text-gray-600 mb-6">No value deals available right now</p>
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
                        <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
                            <div className="text-5xl mb-4">🏷️</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Best Prices</h3>
                            <p className="text-gray-700">Competitive pricing on everyday essentials</p>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200">
                            <div className="text-5xl mb-4">✓</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Quality Guaranteed</h3>
                            <p className="text-gray-700">Premium products at affordable prices</p>
                        </div>
                        <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200">
                            <div className="text-5xl mb-4">🛒</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Shopping</h3>
                            <p className="text-gray-700">Save money without compromising quality</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Why Choose Value Deals?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                            <div className="text-4xl mb-4">💡</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Budgeting</h3>
                            <p className="text-gray-700 leading-relaxed">Get quality products at prices that fit your budget. Perfect for families and bulk buyers.</p>
                        </div>
                        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                            <div className="text-4xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Consistent Quality</h3>
                            <p className="text-gray-700 leading-relaxed">We never compromise on quality. All value deals are from trusted brands and suppliers.</p>
                        </div>
                        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Bulk Discounts</h3>
                            <p className="text-gray-700 leading-relaxed">Buy more, save more. Our value deals offer even better prices when you stock up.</p>
                        </div>
                        <div className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Free Delivery</h3>
                            <p className="text-gray-700 leading-relaxed">Free delivery on orders over €50. Value deals make it easy to reach that threshold.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-yellow-500 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">Start Saving Today!</h2>
                    <p className="text-xl text-amber-100 mb-8">Browse our value deals and get the best bang for your buck</p>
                    <Link href="/products" className="inline-block bg-white text-amber-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                        Browse All Products
                    </Link>
                </div>
            </section>
        </div>
    );
}
