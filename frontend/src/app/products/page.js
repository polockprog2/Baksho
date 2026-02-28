"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { sortProducts, filterByCategory, searchProductsUtil, flattenProduct } from '@/utils/helpers';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { getProducts, getCategories } from '@/api/product.api';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
            <LoadingSpinner size="lg" text="Loading products..." />
        </div>}>
            <ProductsContent />
        </Suspense>
    );
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]); // Store all fetched products
    const [categories, setCategories] = useState([]); // Store fetched categories
    const [error, setError] = useState(null);

    // Fetch products from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    getProducts({ limit: 1000 }),
                    getCategories()
                ]);

                const productsArray = productsRes.data || productsRes;
                const flattenedProducts = productsArray.map(flattenProduct);

                setAllProducts(flattenedProducts);

                const fetchedCategories = categoriesRes.data || categoriesRes;
                setCategories([
                    { name: t.all_products, slug: 'all' },
                    ...fetchedCategories
                ]);

                setError(null);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        if (categoryParam) setSelectedCategory(categoryParam);
        if (searchParam) setSearchQuery(searchParam);

        setTimeout(() => setIsLoading(false), 300);
    }, [searchParams]);

    useEffect(() => {
        let result = [...allProducts];
        result = filterByCategory(result, selectedCategory);
        if (searchQuery) {
            result = searchProductsUtil(result, searchQuery);
        }
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
        if (inStockOnly) {
            result = result.filter(p => p.inStock !== false);
        }
        if (minRating > 0) {
            result = result.filter(p => (p.rating || 0) >= minRating);
        }
        result = sortProducts(result, sortBy);
        setFilteredProducts(result);
    }, [allProducts, selectedCategory, searchQuery, sortBy, priceRange, inStockOnly, minRating]);

    // Categories are now fetched from API

    const getCategoryCount = (slug) => {
        if (slug === 'all') return allProducts.length;
        return allProducts.filter(p => {
            const productCategory = typeof p.category === 'object' ? p.category.slug : p.category;
            return productCategory === slug;
        }).length;
    };

    const getStats = () => {
        const products = selectedCategory === 'all'
            ? allProducts
            : allProducts.filter(p => {
                const productCategory = typeof p.category === 'object' ? p.category.slug : p.category;
                return productCategory === selectedCategory;
            });
        if (products.length === 0) return { min: 0, max: 0, avg: 0, inStock: 0, avgRating: 0 };
        const prices = products.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
            avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2),
            inStock: products.filter(p => p.inStock !== false).length,
            avgRating: (products.reduce((a, b) => a + (b.rating || 0), 0) / products.length).toFixed(1)
        };
    };

    const stats = getStats();

    const hasActiveFilters = selectedCategory !== 'all' || searchQuery || priceRange[0] > 0 || priceRange[1] < 100 || inStockOnly || minRating > 0;

    const clearAllFilters = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setPriceRange([0, 100]);
        setInStockOnly(false);
        setMinRating(0);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
                <LoadingSpinner size="lg" text={t.loading_products} />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-sm font-bold text-slate-900">Active Filters:</span>
                            {selectedCategory !== 'all' && (
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    {categories.find(c => c.slug === selectedCategory)?.name}
                                    <span className="text-lg leading-none">×</span>
                                </button>
                            )}
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    Search: "{searchQuery}"
                                    <span className="text-lg leading-none">×</span>
                                </button>
                            )}
                            {(priceRange[0] > 0 || priceRange[1] < 100) && (
                                <button
                                    onClick={() => setPriceRange([0, 100])}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    Price: ${priceRange[0]} - ${priceRange[1]}
                                    <span className="text-lg leading-none">×</span>
                                </button>
                            )}
                            {inStockOnly && (
                                <button
                                    onClick={() => setInStockOnly(false)}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    In Stock Only
                                    <span className="text-lg leading-none">×</span>
                                </button>
                            )}
                            {minRating > 0 && (
                                <button
                                    onClick={() => setMinRating(0)}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    Rating: {minRating}+
                                    <span className="text-lg leading-none">×</span>
                                </button>
                            )}
                            <button
                                onClick={clearAllFilters}
                                className="ml-auto px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28 border border-gray-200">
                            {/* Categories */}
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.slug}
                                            onClick={() => setSelectedCategory(category.slug)}
                                            className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all duration-300 flex justify-between items-center ${selectedCategory === category.slug
                                                ? 'bg-slate-900 text-white shadow-lg'
                                                : 'hover:bg-gray-100 text-slate-700'
                                                }`}
                                        >
                                            <span>{category.name}</span>
                                            <span className="text-xs font-bold opacity-70">({getCategoryCount(category.slug)})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 mb-2 block">Min: ${priceRange[0]}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-600 mb-2 block">Max: ${priceRange[1]}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Availability</h3>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-5 h-5 rounded accent-slate-900"
                                    />
                                    <span className="font-bold text-slate-700">In Stock Only ({stats.inStock})</span>
                                </label>
                            </div>

                            {/* Rating Filter */}
                            <div className="mb-8">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Minimum Rating</h3>
                                <div className="space-y-2">
                                    {[0, 3, 3.5, 4, 4.5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating)}
                                            className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-all ${minRating === rating
                                                ? 'bg-slate-900 text-white'
                                                : 'hover:bg-gray-100 text-slate-700'
                                                }`}
                                        >
                                            {rating === 0 ? 'All Ratings' : `${rating}+ ⭐`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-bold text-sm"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                    <option value="name-a-z">Name: A-Z</option>
                                    <option value="name-z-a">Name: Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle & View Mode */}
                        <div className="lg:hidden mb-6 flex gap-3">
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </button>
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="px-4 py-3 bg-gray-200 text-slate-900 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            >
                                {viewMode === 'grid' ? '≡ List' : '⊞ Grid'}
                            </button>
                        </div>

                        {/* Mobile Filters */}
                        {isMobileFilterOpen && (
                            <div className="lg:hidden mb-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 space-y-6">
                                {/* Categories */}
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Categories</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.slug}
                                                onClick={() => {
                                                    setSelectedCategory(category.slug);
                                                    setIsMobileFilterOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 rounded-lg font-bold transition-all ${selectedCategory === category.slug
                                                    ? 'bg-slate-900 text-white'
                                                    : 'hover:bg-gray-100 text-slate-700'
                                                    }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="pb-6 border-b border-gray-200">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Price Range</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                        />
                                        <div className="text-sm font-bold text-slate-700">Price: ${priceRange[0]} - ${priceRange[1]}</div>
                                    </div>
                                </div>

                                {/* Stock */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-5 h-5 rounded accent-slate-900"
                                    />
                                    <span className="font-bold text-slate-700">In Stock Only</span>
                                </label>
                            </div>
                        )}

                        {/* Products Grid/List */}
                        {filteredProducts.length > 0 ? (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
                                {filteredProducts.map((product, index) => (
                                    <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-200">
                                <div className="text-8xl mb-6">🔍</div>
                                <h3 className="text-3xl font-black text-slate-900 mb-3">No Products Found</h3>
                                <p className="text-gray-600 font-medium mb-8 max-w-md mx-auto">
                                    {searchQuery
                                        ? `No products match your search for "${searchQuery}"`
                                        : `No products found with the selected filters`}
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
