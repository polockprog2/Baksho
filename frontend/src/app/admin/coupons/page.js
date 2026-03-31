"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupon.api';
import { toast } from 'react-hot-toast';

const emptyForm = {
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minOrder: '',
    maxDiscount: '',
    maxUses: '',
    expiresAt: '',
    isActive: true,
};

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    const fetchCoupons = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getCoupons();
            setCoupons(data.data || []);
        } catch {
            toast.error('Failed to load coupons');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    const openCreate = () => {
        setEditingCoupon(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minOrder: coupon.minOrder || '',
            maxDiscount: coupon.maxDiscount || '',
            maxUses: coupon.maxUses || '',
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
            isActive: coupon.isActive,
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                value: parseFloat(formData.value),
                minOrder: formData.minOrder ? parseFloat(formData.minOrder) : null,
                maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                expiresAt: formData.expiresAt || null,
            };

            if (editingCoupon) {
                await updateCoupon(editingCoupon.id, payload);
                toast.success('Coupon updated!');
            } else {
                await createCoupon(payload);
                toast.success('Coupon created!');
            }

            setShowModal(false);
            fetchCoupons();
        } catch (err) {
            toast.error(err.message || 'Failed to save coupon');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this coupon permanently?')) return;
        try {
            await deleteCoupon(id);
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch {
            toast.error('Failed to delete coupon');
        }
    };

    const StatusBadge = ({ active }) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${active
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
            {active ? 'Active' : 'Inactive'}
        </span>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Coupon Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} configured</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003B4A] rounded-xl text-sm font-bold text-white hover:bg-[#002B36] transition-all shadow-md active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    New Coupon
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Status', ''].map(h => (
                                    <th key={h} className="px-5 py-4 text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={8} className="px-5 py-4 h-14 bg-slate-50/50" />
                                    </tr>
                                ))
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-16 text-center text-slate-400 text-sm font-bold">No coupons yet. Create your first one!</td>
                                </tr>
                            ) : coupons.map(coupon => (
                                <tr key={coupon.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <span className="font-black text-[#003B4A] text-sm tracking-wider">{coupon.code}</span>
                                    </td>
                                    <td className="px-5 py-4 text-xs font-bold text-slate-500 uppercase">{coupon.type}</td>
                                    <td className="px-5 py-4 text-sm font-black text-slate-900">
                                        {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                                        {coupon.minOrder ? `$${coupon.minOrder}` : '—'}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                                        {coupon.usedCount}/{coupon.maxUses ?? '∞'}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">
                                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-5 py-4"><StatusBadge active={coupon.isActive} /></td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openEdit(coupon)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(coupon.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Code *</label>
                                    <input required type="text" value={formData.code}
                                        onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black tracking-widest focus:outline-none focus:border-[#003B4A]"
                                        placeholder="SAVE20" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Type</label>
                                    <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none">
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Value *</label>
                                    <input required type="number" step="0.01" min="0" value={formData.value}
                                        onChange={e => setFormData(p => ({ ...p, value: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#003B4A]"
                                        placeholder={formData.type === 'PERCENTAGE' ? '20' : '5.00'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Min Order ($)</label>
                                    <input type="number" step="0.01" min="0" value={formData.minOrder}
                                        onChange={e => setFormData(p => ({ ...p, minOrder: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        placeholder="Optional" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Max Discount ($)</label>
                                    <input type="number" step="0.01" min="0" value={formData.maxDiscount}
                                        onChange={e => setFormData(p => ({ ...p, maxDiscount: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        placeholder="Optional" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Max Uses</label>
                                    <input type="number" min="1" value={formData.maxUses}
                                        onChange={e => setFormData(p => ({ ...p, maxUses: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                        placeholder="Unlimited" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-1.5">Expires At</label>
                                    <input type="date" value={formData.expiresAt}
                                        onChange={e => setFormData(p => ({ ...p, expiresAt: e.target.value }))}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" />
                                </div>
                                <div className="col-span-2 flex items-center gap-3">
                                    <input type="checkbox" id="coupon-active" checked={formData.isActive}
                                        onChange={e => setFormData(p => ({ ...p, isActive: e.target.checked }))}
                                        className="w-4 h-4 accent-[#003B4A]" />
                                    <label htmlFor="coupon-active" className="text-sm font-bold text-slate-700">Active</label>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-50">Cancel</button>
                                <button type="submit" disabled={isSaving}
                                    className="flex-1 py-3 bg-[#003B4A] text-white rounded-xl text-sm font-black hover:bg-[#002B36] transition-all disabled:opacity-50 shadow-lg">
                                    {isSaving ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
