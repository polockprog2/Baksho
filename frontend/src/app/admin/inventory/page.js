"use client";

import { useState, useEffect } from 'react';
import { getProducts, adjustStock, restockLowItems } from '@/api/product.api';

/**
 * Enterprise Inventory Module
 */
export default function AdminInventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const response = await getProducts({ limit: 100 });
            // Map products to include first variant's stock and id
            const items = response.data.map(p => ({
                id: p.variants?.[0]?.id || p.id, // Use variant ID for adjustments
                productId: p.id,
                name: p.name,
                category: p.category,
                unit: p.variants?.[0]?.name || 'unit',
                stock: p.variants?.[0]?.stock || 0,
                inStock: (p.variants?.[0]?.stock || 0) > 0
            }));
            setInventory(items);
        } catch (error) {
            console.error('Inventory fetch failed');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleAdjustStock = async (id, amount) => {
        setUpdatingId(id);
        try {
            await adjustStock(id, amount);
            // Optimized: update local state instead of refetching
            setInventory(prev => prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        stock: Math.max(0, item.stock + amount),
                        inStock: (item.stock + amount) > 0
                    }
                    : item
            ));
        } catch (error) {
            alert('Failed to adjust stock');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleRestockLow = async () => {
        if (!confirm('Restock all items with less than 10 units by 50 units?')) return;
        setIsProcessing(true);
        try {
            await restockLowItems();
            fetchInventory();
        } catch (error) {
            alert('Restock failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const lowStockThreshold = 10;
    const lowStockItems = inventory.filter(item => (item.stock || 0) < lowStockThreshold);
    const outOfStockItems = inventory.filter(item => !item.inStock);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Real-time stock monitoring and replenishment</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        Download Report
                    </button>
                    <button
                        onClick={handleRestockLow}
                        disabled={isProcessing}
                        className={`px-4 py-2 bg-[#003B4A] rounded-xl text-sm font-bold text-white hover:bg-[#002B36] transition-colors shadow-sm flex items-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                        Restock All Low Items
                    </button>
                </div>
            </div>

            {/* Alerts */}
            {!isLoading && (lowStockItems.length > 0 || outOfStockItems.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-black text-red-900 leading-none">{outOfStockItems.length} Critical Stockouts</p>
                            <p className="text-xs font-bold text-red-700 mt-1 uppercase tracking-wider">Immediate action required</p>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-black text-amber-900 leading-none">{lowStockItems.length} Low Stock Warnings</p>
                            <p className="text-xs font-bold text-amber-700 mt-1 uppercase tracking-wider">Threshold: Under {lowStockThreshold} units</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Item Detail</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">On Hand</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Quick Adjust</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse h-20"><td colSpan="4" className="px-6"><div className="h-8 bg-slate-50 rounded-lg"></div></td></tr>
                                ))
                            ) : inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-slate-900">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.category?.name || 'Uncategorized'} • {item.unit}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-black ${item.stock < lowStockThreshold ? 'text-red-600' : 'text-slate-900'}`}>
                                            {item.stock || 0} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.inStock ? 'Available' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {updatingId === item.id ? (
                                                <div className="w-8 h-8 flex items-center justify-center">
                                                    <div className="w-4 h-4 border-2 border-[#003B4A]/20 border-t-[#003B4A] rounded-full animate-spin"></div>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleAdjustStock(item.id, -1)}
                                                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#003B4A] hover:text-white transition-all font-black"
                                                    >-</button>
                                                    <button
                                                        onClick={() => handleAdjustStock(item.id, 1)}
                                                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-[#003B4A] hover:text-white transition-all font-black"
                                                    >+</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
