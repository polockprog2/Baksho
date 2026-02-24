"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { users } from '@/data/users';

/**
 * Enterprise User Management
 */
export default function AdminUsersPage() {
    const { user: currentUser } = useUser();
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Simulate API fetch
        const fetchUsers = async () => {
            await new Promise(r => setTimeout(r, 400));
            setUserList(users);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = userList.filter(u => {
        const fullName = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim();
        const email = u.email || '';
        const search = searchQuery.toLowerCase();

        return fullName.toLowerCase().includes(search) ||
            email.toLowerCase().includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Found {userList.length} registered customers and staff</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[240px] relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Contact Information</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr className="animate-pulse h-20"><td colSpan="4"></td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-sm font-black text-[#003B4A]">
                                                {u.name ? u.name[0] : 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">
                                                    {u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'No Name'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {u.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-slate-700">{u.email}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{u.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.isAdmin ? 'bg-purple-100 text-purple-700 shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                                            {u.isAdmin ? '👑 Administrator' : '👤 Customer'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#003B4A] transition-colors">
                                            Manage Account
                                        </button>
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
