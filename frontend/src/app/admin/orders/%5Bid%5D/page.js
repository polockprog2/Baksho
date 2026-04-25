"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, updateOrderStatus } from '@/api/order.api';
import { formatPrice } from '@/utils/helpers';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Enterprise Order Details View
 */
export default function OrderDetailsPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        setIsUpdating(true);
        try {
            await updateOrderStatus(id, newStatus);
            setOrder(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            alert('Status update failed');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse p-4">
                <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-[600px] bg-white rounded-3xl border border-slate-100"></div>
                    <div className="h-[400px] bg-white rounded-3xl border border-slate-100"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-black text-[#003B4A]">Order Not Found</h1>
                <Link href="/admin/orders" className="text-blue-500 hover:underline mt-4 inline-block font-bold">Back to Orders</Link>
            </div>
        );
    }

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' };
            case 'processing': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' };
            case 'shipped': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' };
            case 'cancelled': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', dot: 'bg-slate-500' };
        }
    };

    const statusStyle = getStatusVariant(order.status);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                        <Link href="/admin" className="hover:text-[#003B4A] transition-colors">Admin</Link>
                        <span>/</span>
                        <Link href="/admin/orders" className="hover:text-[#003B4A] transition-colors">Orders</Link>
                        <span>/</span>
                        <span className="text-slate-900">{order.id.slice(0, 8)}...</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#003B4A] tracking-tight flex items-center gap-4">
                        Order Details
                        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} shadow-sm`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm font-bold mt-2">Ordered on {new Date(order.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all hover:shadow-md flex items-center gap-2 uppercase tracking-widest"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Invoice
                    </button>
                    <select
                        disabled={isUpdating}
                        className="px-6 py-3 bg-[#003B4A] rounded-xl text-xs font-black text-white hover:bg-[#002B36] transition-all hover:shadow-lg outline-none cursor-pointer uppercase tracking-widest"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Items List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)] overflow-hidden">
                        <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <h3 className="text-xl font-black text-[#003B4A]">Order Items</h3>
                            <span className="px-5 py-1.5 bg-white rounded-full text-[10px] font-black text-[#003B4A] shadow-sm border border-slate-100 uppercase tracking-widest">
                                {order.items?.length} products
                            </span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {order.items?.map((item) => (
                                <div key={item.id} className="p-8 flex items-center gap-6 group">
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                                        {item.product?.image ? (
                                            <Image 
                                                src={item.product.image || '/placeholder-product.png'} 
                                                alt={item.name} 
                                                width={80} 
                                                height={80} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-black text-slate-900 truncate">{item.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: {item.productId}</p>
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Price</p>
                                        <p className="text-sm font-black text-slate-900">€{item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Qty</p>
                                        <p className="text-sm font-black text-slate-900">x{item.quantity}</p>
                                    </div>
                                    <div className="text-right px-4">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-sm font-black text-[#003B4A]">€{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-10 bg-slate-50/50 border-t border-slate-100">
                            <div className="max-w-xs ml-auto space-y-4">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>€{order.total?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-black">Free</span>
                                </div>
                                <div className="h-px bg-slate-200"></div>
                                <div className="flex justify-between items-center text-xl font-black text-[#003B4A]">
                                    <span>Total</span>
                                    <span className="text-2xl">€{order.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Customer Info & Timeline */}
                <div className="space-y-8">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)]">
                        <h3 className="text-xl font-black text-[#003B4A] mb-8">Customer Details</h3>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-xl font-black shadow-sm border border-emerald-100">
                                    {order.user?.name?.[0] || 'C'}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900">{order.user?.name || 'Guest Customer'}</h4>
                                    <p className="text-xs font-bold text-slate-500 mt-1">{order.user?.email || order.customerEmail}</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">Shipping Address</p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                        {order.shippingAddress || (
                                            <span className="italic text-slate-300">No address provided</span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">Contact Method</p>
                                    <p className="text-sm font-bold text-slate-700">{order.phone || 'Phone not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">Payment Method</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">💳</div>
                                        <p className="text-sm font-black text-[#003B4A] uppercase tracking-wider">{order.paymentMethod || 'Credit Card'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#003B4A] p-8 md:p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                        <h3 className="text-lg font-black mb-6 relative z-10">Internal Notes</h3>
                        <p className="text-xs font-bold text-blue-200/80 leading-relaxed relative z-10">
                            Customer requested doorstep delivery. Check expiry dates for fresh items before packing.
                        </p>
                        <button className="mt-8 w-full py-4 rounded-2xl bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 hover:bg-white/20 transition-all relative z-10">
                            Add Internal Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
