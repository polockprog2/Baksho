"use client";

import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/api/dashboard.api';
import Link from 'next/link';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, Legend
} from 'recharts';

/**
 * Premium Enterprise Dashboard 
 * Features interactive charts, Top Products, and real-time KPIs
 */
export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const data = await getDashboardStats();
                setStats(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
                setError(err.message || 'An unexpected error occurred while loading dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse p-8">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
                    <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[450px] bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
                    <div className="h-[450px] bg-white rounded-3xl border border-slate-100 shadow-sm"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[2.5rem] border border-rose-100 shadow-xl m-8">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-4xl mb-6">⚠️</div>
                <h2 className="text-2xl font-black text-[#003B4A] mb-4">Connection to Dashboard Failed</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-[#003B4A] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#002B36] transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#003B4A] tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 text-sm font-bold mt-1.5 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Live Store Statistics • Last updated just now
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all hover:shadow-md flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export Data
                    </button>
                    <Link
                        href="/admin/products?add=true"
                        className="px-6 py-2.5 bg-[#003B4A] rounded-xl text-sm font-black text-white hover:bg-[#002B36] transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-xl shadow-[#003B4A]/10"
                    >
                        + New Product
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats?.kpis.map((kpi) => (
                    <div key={kpi.id} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)] transition-all duration-500 group relative overflow-hidden">
                        {/* Abstract background shape */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-[#F9F7F2] rounded-2xl flex items-center justify-center text-[#003B4A] group-hover:bg-[#003B4A] group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                    {kpi.icon === 'shopping-bag' && (
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    )}
                                    {kpi.icon === 'euro' && (
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                    {kpi.icon === 'users' && (
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    )}
                                    {kpi.icon === 'alert-triangle' && (
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )}
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-xl ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {kpi.trend.startsWith('+') ? '↑' : '↓'} {kpi.trend.replace('+', '')}
                                </div>
                            </div>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.15em] ml-0.5">{kpi.label}</p>
                            <h3 className="text-4xl font-black text-[#003B4A] mt-2 tracking-tighter">{kpi.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)]">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                            <div>
                                <h3 className="text-xl font-black text-[#003B4A]">Revenue performance</h3>
                                <p className="text-slate-500 text-xs font-bold mt-1">Growth trends and financial analytics</p>
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                <button className="px-4 py-2 bg-white text-[#003B4A] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-slate-100">Weekly</button>
                                <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#003B4A] transition-colors">Monthly</button>
                                <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-[#003B4A] transition-colors">Yearly</button>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.salesData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#003B4A" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#003B4A" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#003B4A', border: 'none', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                        labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#003B4A"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products Grid */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-[#003B4A]">Top selling products</h3>
                                <p className="text-slate-500 text-xs font-bold mt-1">Best performing items by revenue</p>
                            </div>
                            <Link href="/admin/products" className="text-[10px] font-black text-[#003B4A] uppercase tracking-widest hover:underline">View Inventory →</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats?.topProducts?.map((product, idx) => (
                                <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[#F9F7F2]/50 border border-[#F9F7F2] hover:border-[#003B4A]/10 transition-all group">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-black text-[#003B4A] truncate">{product.name}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-slate-500">
                                            <span>{product.sales} sales</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{product.stock} in stock</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#003B4A]">${(product.revenue || 0).toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-emerald-500 mt-0.5">#{idx + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-8">
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)] h-full">
                        <h3 className="text-xl font-black text-[#003B4A] mb-8">Recent orders</h3>
                        <div className="space-y-8">
                            {stats?.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[10px] font-black text-[#003B4A] shadow-inner shrink-0 relative">
                                        {/* Status Dot */}
                                        <div className={`absolute -right-1 -top-1 w-3 h-3 rounded-full border-2 border-white ${order.status === 'DELIVERED' ? 'bg-emerald-500' :
                                            order.status === 'PROCESSING' ? 'bg-amber-500' : 'bg-[#003B4A]'
                                            }`}></div>
                                        {order.id.slice(-4)}
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-black text-[#003B4A]">${order.total.toFixed(2)}</p>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{order.date}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 truncate">
                                            {order.itemsCount} items • <span className={`font-black ${order.status === 'DELIVERED' ? 'text-emerald-500' :
                                                order.status === 'PROCESSING' ? 'text-amber-500' : 'text-[#003B4A]'
                                                }`}>{order.status}</span>
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="p-2 text-slate-300 hover:text-[#003B4A] hover:bg-slate-50 rounded-xl transition-all mt-1"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-50">
                            <Link
                                href="/admin/orders"
                                className="flex items-center justify-center w-full py-4 rounded-2xl bg-slate-50 text-[10px] font-black text-[#003B4A] uppercase tracking-[0.2em] hover:bg-[#003B4A] hover:text-white transition-all duration-300 group"
                            >
                                All Orders
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>

                            <div className="mt-8 p-6 rounded-3xl bg-[#003B4A] text-white overflow-hidden relative group">
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Inventory Alert</p>
                                <h4 className="text-sm font-black mb-4">Stock levels are low for {stats?.kpis.find(k => k.id === 'low-stock')?.value || 0} items</h4>
                                <Link
                                    href="/admin/products?stock=low"
                                    className="inline-block px-4 py-2 bg-white text-[#003B4A] text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity relative z-10"
                                >
                                    Refill Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
