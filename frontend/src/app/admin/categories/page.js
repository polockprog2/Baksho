"use client";

import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/product.api';

/**
 * Enterprise Category Management
 */
export default function AdminCategoriesPage() {
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        icon: '📦',
        description: '',
        badge: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const data = await getCategories();
            setCategoryList(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            alert(error.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will fail if there are products in this category.')) return;
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (error) {
            alert(error.message || 'Delete failed');
        }
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            icon: category.icon || '📦',
            description: category.description || '',
            badge: category.badge || ''
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            slug: '',
            icon: '📦',
            description: '',
            badge: ''
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Category Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Organize your products with custom categories and icons</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003B4A] rounded-xl text-sm font-bold text-white hover:bg-[#002B36] transition-all shadow-md active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-white border border-slate-200 rounded-2xl animate-pulse"></div>
                    ))
                ) : categoryList.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openEditModal(category)}
                                className="p-1.5 bg-blue-50 text-blue-400 hover:text-blue-600 rounded-lg transition-colors border border-blue-100 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="p-1.5 bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors border border-red-100 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                        <div className="w-16 h-16 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {category.icon}
                        </div>
                        <h3 className="text-lg font-black text-slate-900">{category.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Slug: {category.slug}</p>

                        {category.badge && (
                            <div className="mt-2">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                                    {category.badge}
                                </span>
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-[11px] font-black text-[#003B4A] bg-[#003B4A]/5 px-2.5 py-1.5 rounded-xl uppercase tracking-widest">
                                {category.productCount || 0} Products
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-black text-[#003B4A]">{editingCategory ? 'Edit Category' : 'Create New Category'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 border border-transparent hover:border-slate-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#003B4A]/10 focus:border-[#003B4A] transition-all"
                                        value={formData.name}
                                        onChange={e => {
                                            const name = e.target.value;
                                            setFormData(p => ({
                                                ...p,
                                                name,
                                                slug: editingCategory ? p.slug : name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                            }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none"
                                        value={formData.slug}
                                        onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none"
                                        value={formData.icon}
                                        onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Badge (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., NEW, PREM"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none"
                                        value={formData.badge}
                                        onChange={e => setFormData(p => ({ ...p, badge: e.target.value.toUpperCase() }))}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                                    <textarea
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none min-h-[100px] resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 px-8 py-4 bg-[#003B4A] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#002B36] transition-all shadow-xl shadow-[#003B4A]/20 active:scale-95">
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
