"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { flattenProduct } from '@/utils/helpers';
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
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    // State for data
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current filters from URL
    const currentPage = parseInt(searchParams.get('page') || '1');
    const currentCategory = searchParams.get('category') || 'all';
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'newest';

    // Fetch data whenever URL parameters change
    useEffect(() => {
        const fetchFilteredData = async () => {
            setIsLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: 12,
                    sort: currentSort,
                };

                if (currentCategory !== 'all') params.category = currentCategory;
                if (currentSearch) params.search = currentSearch;

                const [productsRes, categoriesRes] = await Promise.all([
                    getProducts(params),
                    getCategories()
                ]);

                const productsArray = productsRes.data || [];
                setProducts(productsArray.map(flattenProduct));
                setPagination(productsRes.meta || { total: productsArray.length, page: 1, limit: 12, totalPages: 1 });

                const fetchedCategories = categoriesRes.data || categoriesRes;
                setCategories([
                    { name: t.all_products, slug: 'all' },
                    ...fetchedCategories
                ]);

                setError(null);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredData();
    }, [currentPage, currentCategory, currentSearch, currentSort, t.all_products]);

    // Update URL when filters change
    const updateFilters = (updates) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === 'all' || value === '' || value === null || (key === 'page' && value === 1)) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Always reset to page 1 when changing filters other than page
        if (!updates.page) {
            params.delete('page');
        }

        router.push(`/products?${params.toString()}`);
    };

    const handleCategoryChange = (slug) => updateFilters({ category: slug });
    const handleSortChange = (sort) => updateFilters({ sort });
    const handlePageChange = (page) => updateFilters({ page });

    const clearAllFilters = () => {
        router.push('/products');
    };

    if (isLoading && products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
                <LoadingSpinner size="lg" text={t.loading_products} />
            </div>
        );
    }

    const hasActiveFilters = currentCategory !== 'all' || currentSearch;

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-bold text-slate-900">Active Filters:</span>
                            {currentCategory !== 'all' && (
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    Category: {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
                                    <span className="text-lg leading-none">×</span>
                                </button>
                            )}
                            {currentSearch && (
                                <button
                                    onClick={() => updateFilters({ search: '' })}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-slate-700 hover:bg-blue-100 transition-colors"
                                >
                                    Search: "{currentSearch}"
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
                            <div className="mb-8 pb-8 border-b border-gray-200">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.slug}
                                            onClick={() => handleCategoryChange(category.slug)}
                                            className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all duration-300 flex justify-between items-center ${currentCategory === category.slug
                                                ? 'bg-slate-900 text-white shadow-lg'
                                                : 'hover:bg-gray-100 text-slate-700'
                                                }`}
                                        >
                                            <span>{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Sort By</h3>
                                <select
                                    value={currentSort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-bold text-sm"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name-az">Name: A-Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-6">
                            <select
                                value={currentCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg font-bold text-slate-900 mb-3"
                            >
                                {categories.map(c => (
                                    <option key={c.slug} value={c.slug}>{c.name}</option>
                                ))}
                            </select>
                            <select
                                value={currentSort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg font-bold text-slate-900"
                            >
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-az">Name: A-Z</option>
                            </select>
                        </div>

                        {/* Inventory Stats Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">
                                {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
                            </h2>
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="py-20 flex justify-center">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product, index) => (
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
                                    {currentSearch
                                        ? `No products match your search for "${currentSearch}"`
                                        : `No products found in this category`}
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <button
                                    disabled={pagination.page <= 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-slate-900 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Previous
                                </button>
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${pagination.page === i + 1
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white border border-gray-200 text-slate-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-bold text-slate-900 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

