"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { getOrders } from '@/api/order.api';
import { formatPrice, formatDate, getOrderStatusColor } from '@/utils/helpers';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, updateProfile, addAddress, updateAddress, deleteAddress } = useUser();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const [orders, setOrders] = useState([]);

    // Modal States
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        type: 'Home',
        isDefault: false
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated()) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                if (user?.id) {
                    const response = await getOrders({ userId: user.id });
                    setOrders(response.data || response);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        if (user) {
            setProfileForm({ name: user.name || '', phone: user.phone || '' });
            fetchOrders();
        }
    }, [isLoading, isAuthenticated, router, user?.id, user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        const res = await updateProfile(profileForm);
        if (res.success) {
            setIsEditProfileOpen(false);
        } else {
            setError(res.error);
        }
        setFormLoading(false);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        let res;
        if (editingAddress) {
            res = await updateAddress(editingAddress.id, addressForm);
        } else {
            res = await addAddress(addressForm);
        }

        if (res.success) {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
            setAddressForm({ street: '', city: '', state: '', zipCode: '', type: 'Home', isDefault: false });
        } else {
            setError(res.error);
        }
        setFormLoading(false);
    };

    const handleDeleteAddress = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            await deleteAddress(id);
        }
    };

    const openEditAddress = (address) => {
        setEditingAddress(address);
        setAddressForm({
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            type: address.type,
            isDefault: address.isDefault
        });
        setIsAddressModalOpen(true);
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] py-32 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#003B4A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#003B4A] font-bold">Loading profile...</p>
                </div>
            </div>
        );
    }

    const getInitials = () => {
        if (!user.name) return 'U';
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-black text-[#003B4A] mb-12 uppercase tracking-tight">{t.my_profile}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100 sticky top-28">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#003B4A] to-[#0A9396] rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-xl shadow-[#003B4A]/20">
                                    {getInitials()}
                                </div>
                                <h2 className="text-2xl font-black text-[#003B4A] mb-1">
                                    {user.name}
                                </h2>
                                <p className="text-gray-400 font-bold text-sm tracking-wide">{user.email}</p>
                            </div>

                            <div className="space-y-3">
                                <a href="#profile" className="block px-6 py-4 rounded-2xl bg-[#F9F7F2] text-[#003B4A] font-black uppercase tracking-widest text-xs transition-all hover:translate-x-1">
                                    {t.profile_info}
                                </a>
                                <a href="#orders" className="block px-6 py-4 rounded-2xl hover:bg-[#F9F7F2] text-gray-400 hover:text-[#003B4A] font-black uppercase tracking-widest text-xs transition-all hover:translate-x-1">
                                    {t.order_history}
                                </a>
                                <a href="#addresses" className="block px-6 py-4 rounded-2xl hover:bg-[#F9F7F2] text-gray-400 hover:text-[#003B4A] font-black uppercase tracking-widest text-xs transition-all hover:translate-x-1">
                                    {t.saved_addresses}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Profile Information */}
                        <div id="profile" className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-gray-100">
                            <h3 className="text-2xl font-black text-[#003B4A] mb-8 uppercase tracking-wider">{t.profile_info}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                    <p className="text-[#003B4A] font-bold text-lg">{user.name}</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">{t.email_label}</label>
                                    <p className="text-[#003B4A] font-bold text-lg">{user.email}</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">{t.phone_number}</label>
                                    <p className="text-[#003B4A] font-bold text-lg">{user.phone || 'Not provided'}</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">{t.member_since}</label>
                                    <p className="text-[#003B4A] font-bold text-lg">{formatDate(user.createdAt)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditProfileOpen(true)}
                                className="mt-10 bg-[#003B4A] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#003B4A]/90 transition-all shadow-lg shadow-[#003B4A]/10 active:scale-95"
                            >
                                {t.edit_profile}
                            </button>
                        </div>

                        {/* Order History */}
                        <div id="orders" className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-gray-100">
                            <h3 className="text-2xl font-black text-[#003B4A] mb-8 uppercase tracking-wider">{t.order_history}</h3>

                            {orders.length > 0 ? (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="bg-[#F9F7F2] rounded-[2rem] p-6 transition-all hover:shadow-xl hover:shadow-[#003B4A]/5 border border-transparent hover:border-white">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                                <div>
                                                    <p className="font-black text-[#003B4A] text-xl">#{order.id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-gray-400 font-bold text-sm tracking-wide">{formatDate(order.createdAt)}</p>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm ${getOrderStatusColor(order.status)}`}>
                                                    {order.status.replace('-', ' ')}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-6 bg-white/50 p-4 rounded-2xl">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm font-bold">
                                                        <span className="text-gray-500 truncate max-w-[70%]">
                                                            {item.productName} <span className="text-[#003B4A]/30 mx-2">×</span> {item.quantity}
                                                        </span>
                                                        <span className="text-[#003B4A] whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-[#003B4A]/5">
                                                <span className="font-black text-[#003B4A] text-lg uppercase tracking-wider">{t.total}: {formatPrice(order.total)}</span>
                                                <Link href={`/order-success?orderId=${order.id}`} className="text-green-600 font-black text-sm uppercase tracking-widest hover:underline underline-offset-8">
                                                    {t.view_details} →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-8xl mb-6">📦</div>
                                    <p className="text-gray-500 font-bold mb-8">{t.no_orders}</p>
                                    <Link href="/products" className="bg-[#003B4A] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#003B4A]/90 transition-all shadow-xl shadow-[#003B4A]/20">
                                        {t.start_shopping}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Saved Addresses */}
                        <div id="addresses" className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-gray-100">
                            <h3 className="text-2xl font-black text-[#003B4A] mb-8 uppercase tracking-wider">{t.saved_addresses}</h3>

                            {user.addresses && user.addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.addresses.map((address) => (
                                        <div key={address.id} className="bg-[#F9F7F2] rounded-[2rem] p-6 border border-transparent hover:border-white transition-all shadow-sm group relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 bg-[#003B4A] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    {address.type}
                                                </span>
                                                <div className="flex gap-2">
                                                    {address.isDefault && (
                                                        <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                            {t.default}
                                                        </span>
                                                    )}
                                                    <button onClick={() => openEditAddress(address)} className="p-1 text-gray-400 hover:text-[#003B4A] transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteAddress(address.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-[#003B4A] font-black text-lg mb-1">{address.street}</p>
                                            <p className="text-gray-500 font-bold text-sm">
                                                {address.city}, {address.state} {address.zipCode}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-8xl mb-6">📍</div>
                                    <p className="text-gray-500 font-bold mb-8">{t.no_addresses}</p>
                                    <button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="bg-[#003B4A] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#003B4A]/90 transition-all shadow-xl shadow-[#003B4A]/10"
                                    >
                                        {t.add_address}
                                    </button>
                                </div>
                            )}

                            {user.addresses && user.addresses.length > 0 && (
                                <button
                                    onClick={() => {
                                        setEditingAddress(null);
                                        setAddressForm({ street: '', city: '', state: '', zipCode: '', type: 'Home', isDefault: false });
                                        setIsAddressModalOpen(true);
                                    }}
                                    className="mt-8 bg-transparent text-[#003B4A] border-2 border-[#003B4A] px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#003B4A] hover:text-white transition-all"
                                >
                                    + {t.add_address}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditProfileOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-[#003B4A] uppercase tracking-wider">Edit Profile</h2>
                            <button onClick={() => setIsEditProfileOpen(false)} className="text-gray-400 hover:text-black">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold"
                                    value={profileForm.name}
                                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold"
                                    value={profileForm.phone}
                                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                                />
                            </div>
                            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-6 py-4 rounded-2xl bg-[#003B4A] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#003B4A]/20">
                                    {formLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Address Modal (Add/Edit) */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-200 my-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-[#003B4A] uppercase tracking-wider">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h2>
                            <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-black">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold"
                                        value={addressForm.street}
                                        onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold"
                                        value={addressForm.city}
                                        onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">State</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold"
                                        value={addressForm.state}
                                        onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">Zip Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold"
                                        value={addressForm.zipCode}
                                        onChange={e => setAddressForm(p => ({ ...p, zipCode: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest">Address Type</label>
                                    <select
                                        className="w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:ring-2 focus:ring-[#003B4A]/20 font-bold appearance-none"
                                        value={addressForm.type}
                                        onChange={e => setAddressForm(p => ({ ...p, type: e.target.value }))}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    className="w-5 h-5 accent-[#003B4A] rounded"
                                    checked={addressForm.isDefault}
                                    onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))}
                                />
                                <label htmlFor="isDefault" className="text-sm font-black text-[#003B4A]">Set as default address</label>
                            </div>
                            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="flex-1 px-6 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-xs">Cancel</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-6 py-4 rounded-2xl bg-[#003B4A] text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-[#003B4A]/20">
                                    {formLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
