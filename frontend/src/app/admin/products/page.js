"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, updateProduct, deleteProduct, createProduct, bulkUploadProducts } from '@/api/product.api';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/utils/helpers';

/**
 * Enterprise Product Management
 * Features: API Integration, Pagination, Sorting, Search, Selection
 */
export default function AdminProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ category: '', sort: 'newest' });

    // UI States
    const [showModal, setShowModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResults, setUploadResults] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'vegetables',
        price: '',
        discount: 0,
        inStock: true,
        unit: '1 kg',
        stock: 100
    });

    const fetchProducts = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await getProducts({
                page,
                limit: 10,
                search: searchQuery,
                category: filters.category,
                sort: filters.sort,
                // If stock filter is needed on API level, it should be added here
            });
            let data = response.data;

            // Client-side stock filtering if backend doesn't support it yet
            if (searchParams.get('stock') === 'low') {
                data = data.filter(p => !p.inStock || (p.stock && p.stock < 10));
            }

            setProducts(data);
            setMeta(response.meta);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, filters, searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    // Handle deep links (add=true)
    useEffect(() => {
        if (searchParams.get('add') === 'true') {
            openCreateModal();
        }
    }, [searchParams]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
            } else {
                await createProduct(formData);
            }
            setShowModal(false);
            fetchProducts(meta.page);
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteProduct(id);
            fetchProducts(meta.page);
        } catch (error) {
            alert('Delete failed');
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category?.slug || product.category,
            price: product.price,
            discount: product.discount || 0,
            inStock: product.inStock,
            unit: product.unit
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category: 'vegetables',
            price: '',
            discount: 0,
            inStock: true,
            unit: '1 kg'
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Product Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Total of {meta.total} products in your catalog</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#003B4A] rounded-xl text-sm font-bold text-[#003B4A] hover:bg-[#003B4A]/5 transition-all shadow-sm active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Bulk Upload
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#003B4A] rounded-xl text-sm font-bold text-white hover:bg-[#002B36] transition-all shadow-md active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[240px] relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 focus:border-[#003B4A] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                    <option value="">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="meat-fish">Meat & Fish</option>
                    <option value="dairy">Dairy</option>
                </select>
                <select
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none"
                    value={filters.sort}
                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                >
                    <option value="newest">Newest First</option>
                    <option value="name-az">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                </select>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Inventory</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4 h-16 bg-slate-50/50"></td>
                                    </tr>
                                ))
                            ) : products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg font-bold">
                                                    {product.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{product.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{product.unit || 'Standard Unit'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg tracking-wider">
                                                {product.category?.name || product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">{formatPrice(product.price)}</span>
                                                {product.discount > 0 && (
                                                    <span className="text-[10px] text-red-500 font-bold">-{product.discount}% Discount</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-[11px] font-black ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                                                    {product.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <p className="text-slate-500 text-sm font-bold">No products found matching your search criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                        Page {meta.page} of {meta.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={meta.page <= 1}
                            onClick={() => fetchProducts(meta.page - 1)}
                            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => fetchProducts(meta.page + 1)}
                            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900">{editingProduct ? 'Edit Product Details' : 'Create New Listing'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B4A]"
                                        value={formData.name}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                    >
                                        <option value="vegetables">Vegetables</option>
                                        <option value="fruits">Fruits</option>
                                        <option value="meat-fish">Meat & Fish</option>
                                        <option value="dairy">Dairy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Unit (e.g., 1 kg)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        value={formData.unit}
                                        onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Base Price (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        value={formData.price}
                                        onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Discount (%)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        value={formData.discount}
                                        onChange={e => setFormData(p => ({ ...p, discount: parseInt(e.target.value) }))}
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="inStock"
                                        className="w-5 h-5 accent-[#003B4A] rounded"
                                        checked={formData.inStock}
                                        onChange={e => setFormData(p => ({ ...p, inStock: e.target.checked }))}
                                    />
                                    <label htmlFor="inStock" className="text-sm font-black text-slate-900">Mark as 'In Stock'</label>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-100 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-6 py-3 bg-[#003B4A] text-white rounded-xl text-sm font-black hover:bg-[#002B36] transition-all shadow-lg active:scale-95">
                                    {editingProduct ? 'Update Listing' : 'Create Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[151] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900">Bulk Product Upload</h2>
                            <button onClick={() => { setShowBulkModal(false); setUploadResults(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-8 space-y-6">
                            {!uploadResults ? (
                                <>
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                        <h3 className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2">CSV Format Requirements</h3>
                                        <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
                                            The CSV should have the following headers:<br />
                                            <code className="bg-blue-100 px-1 rounded">name,slug,description,categorySlug,variantName,price,originalPrice,stock,sku,imageUrls</code>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-10 hover:border-[#003B4A] transition-colors bg-slate-50/50">
                                        <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        <p className="text-sm font-bold text-slate-600 mb-4 text-center">Drag and drop your CSV file here or click to browse</p>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            className="hidden"
                                            id="bulk-file-upload"
                                            disabled={isUploading}
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                setIsUploading(true);
                                                try {
                                                    const res = await bulkUploadProducts(file);
                                                    setUploadResults(res);
                                                    fetchProducts(1);
                                                    toast.success('Upload completed!');
                                                } catch (error) {
                                                    toast.error('Upload failed: ' + error.message);
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="bulk-file-upload"
                                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm active:scale-95 ${isUploading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#003B4A] text-white hover:bg-[#002B36]'}`}
                                        >
                                            {isUploading ? 'Processing File...' : 'Select CSV File'}
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-green-700">{uploadResults.success}</p>
                                            <p className="text-xs font-bold text-green-600 uppercase">Success</p>
                                        </div>
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                                            <p className="text-2xl font-black text-red-700">{uploadResults.failed}</p>
                                            <p className="text-xs font-bold text-red-600 uppercase">Failed</p>
                                        </div>
                                    </div>
                                    {uploadResults.errors.length > 0 && (
                                        <div className="max-h-40 overflow-y-auto p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Errors Details</h4>
                                            <ul className="space-y-1">
                                                {uploadResults.errors.map((err, idx) => (
                                                    <li key={idx} className="text-[11px] text-red-600 font-medium">#{idx + 1}: {err}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => { setShowBulkModal(false); setUploadResults(null); }}
                                        className="w-full py-3 bg-[#003B4A] text-white rounded-xl text-sm font-black hover:bg-[#002B36] transition-all shadow-lg active:scale-95"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
