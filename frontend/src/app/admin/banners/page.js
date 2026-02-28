"use client";

import { useState } from 'react';
import { useBanners } from '@/context/BannerContext';

export default function AdminBanners() {
    const { banners, addBanner, updateBanner, deleteBanner, toggleBannerStatus } = useBanners();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '',
        type: 'ad'
    });

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                subtitle: banner.subtitle,
                imageUrl: banner.imageUrl,
                link: banner.link,
                type: banner.type
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                imageUrl: '',
                link: '',
                type: 'ad'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBanner) {
            updateBanner(editingBanner.id, formData);
        } else {
            addBanner(formData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Promotional Banners</h1>
                    <p className="text-slate-500 mt-1">Manage homepage ads and weekly sales banners.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#003B4A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002B36] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Banner
                </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-md transition-all">
                        <div className="h-40 relative">
                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${banner.active ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                                    }`}>
                                    {banner.active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900 truncate pr-4">{banner.title}</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{banner.type}</span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem] mb-4">{banner.subtitle}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(banner)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => toggleBannerStatus(banner.id)}
                                        className={`p-2 rounded-lg transition-colors ${banner.active ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                                        title={banner.active ? "Deactivate" : "Activate"}
                                    >
                                        {banner.active ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this banner?')) {
                                                deleteBanner(banner.id);
                                            }
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4M12 9v6" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-[10px] font-bold text-slate-400">ID: {banner.id}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl relative p-8 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#003B4A] focus:ring-4 focus:ring-[#003B4A]/10 transition-all outline-none"
                                        placeholder="Banner Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Type</label>
                                    <select
                                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#003B4A] focus:ring-4 focus:ring-[#003B4A]/10 transition-all outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="ad">General Ad</option>
                                        <option value="weekly-sale">Weekly Sale</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Subtitle / Description</label>
                                <textarea
                                    required
                                    rows="2"
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#003B4A] focus:ring-4 focus:ring-[#003B4A]/10 transition-all outline-none resize-none"
                                    placeholder="Brief description..."
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Image URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#003B4A] focus:ring-4 focus:ring-[#003B4A]/10 transition-all outline-none"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Link Target</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#003B4A] focus:ring-4 focus:ring-[#003B4A]/10 transition-all outline-none"
                                    placeholder="/products?category=..."
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-6 py-4 rounded-2xl font-bold text-white bg-[#003B4A] hover:bg-[#002B36] transition-all shadow-xl hover:shadow-2xl shadow-[#003B4A]/20"
                                >
                                    {editingBanner ? 'Save Changes' : 'Create Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
