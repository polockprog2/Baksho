"use client";

import { useState, useEffect } from 'react';
import { getUsers, adminUpdateUser } from '@/api/user.api';

/**
 * Enterprise User & Customer Management
 */
export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchUsers = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await getUsers({ page, search, limit: 10 });
            setUsers(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleRoleUpdate = async (id, newRole) => {
        if (!confirm(`Change user role to ${newRole}?`)) return;
        setIsUpdating(true);
        try {
            await adminUpdateUser(id, { role: newRole });
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
        } catch (error) {
            alert('Failed to update user role');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#003B4A] tracking-tight">User Management</h1>
                    <p className="text-slate-500 text-sm font-bold mt-2">Manage customer accounts and administrative privileges</p>
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#003B4A]/5 focus:border-[#003B4A] transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse h-24"><td colSpan="4" className="px-8"></td></tr>
                                ))
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-lg font-black group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-200">
                                                {user.name?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{user.name || 'No Name'}</p>
                                                <p className="text-xs font-bold text-slate-500 mt-0.5">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-slate-600">
                                            {new Date(user.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border ${user.role === 'ADMIN'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold'
                                            : 'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleRoleUpdate(user.id, user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                                                disabled={isUpdating}
                                                className="px-4 py-2 bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-xl text-[9px] font-black text-slate-400 hover:text-[#003B4A] transition-all uppercase tracking-widest shadow-sm active:scale-95 disabled:opacity-50"
                                            >
                                                Toggle Role
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => fetchUsers(p)}
                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${meta.page === p
                                ? 'bg-[#003B4A] text-white shadow-[#003B4A]/20'
                                : 'bg-white text-slate-400 hover:border-slate-300 border border-slate-100'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
