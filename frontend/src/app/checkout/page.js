"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { formatPrice } from '@/utils/helpers';
import { createOrder } from '@/api/order.api';

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems, getCartSubtotal, getCartTax, getDeliveryFee, getCartGrandTotal, clearCart,
        getCouponDiscount, appliedCoupon, couponError, isCouponLoading, applyCoupon, removeCoupon } = useCart();
    const { user } = useUser();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [formData, setFormData] = useState({
        firstName: user?.name ? user.name.split(' ')[0] : '',
        lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user?.email || '',
        phone: user?.phone || '',
        street: user?.addresses?.[0]?.street || '',
        city: user?.addresses?.[0]?.city || '',
        state: user?.addresses?.[0]?.state || '',
        zipCode: user?.addresses?.[0]?.zipCode || '',
        paymentMethod: 'credit-card'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponInput, setCouponInput] = useState('');

    // Redirect if cart is empty - Move to useEffect to prevent render-time update error
    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartItems.length, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = t.first_name_req || 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = t.last_name_req || 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = t.email_req || 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t.email_invalid || 'Invalid email format';
        }
        if (!formData.phone.trim()) newErrors.phone = t.phone_req || 'Phone number is required';
        if (!formData.street.trim()) newErrors.street = t.street_req || 'Street address is required';
        if (!formData.city.trim()) newErrors.city = t.city_req || 'City is required';
        if (!formData.state.trim()) newErrors.state = t.state_req || 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = t.zip_req || 'Zip code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal: getCartSubtotal(),
                tax: getCartTax(),
                deliveryFee: getDeliveryFee(),
                total: getCartGrandTotal(),
                paymentMethod: formData.paymentMethod,
                couponId: appliedCoupon?.id || null,
                couponDiscount: getCouponDiscount(),
                // Send inline address from the checkout form
                deliveryAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: 'USA'
                }
            };

            // If user has a saved address, also include the ID as a preference
            if (user?.addresses?.[0]?.id) {
                orderData.deliveryAddressId = user.addresses[0].id;
            }

            const response = await createOrder(orderData);
            const orderId = response.id || response.data?.id || Date.now();
            clearCart();
            router.push(`/order-success?orderId=${orderId}`);
        } catch (error) {
            console.error('Failed to create order:', error);
            setErrors({ submit: error.message || t.order_error || 'Failed to create order. Please try again.' });
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-black text-[#003B4A] mb-12 uppercase tracking-tight">{t.checkout}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Personal Information */}
                            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-gray-100">
                                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10">{t.profile_info}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.first_name} *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.firstName ? 'ring-2 ring-red-500/20' : ''}`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.firstName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.last_name} *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.lastName ? 'ring-2 ring-red-500/20' : ''}`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.lastName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.email_label} *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.email ? 'ring-2 ring-red-500/20' : ''}`}
                                        />
                                        {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.phone_number} *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.phone ? 'ring-2 ring-red-500/20' : ''}`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30_rgb(0,0,0,0.04)] p-8 md:p-12 border border-gray-100">
                                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10">{t.delivery_address}</h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.street_address} *</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.street ? 'ring-2 ring-red-500/20' : ''}`}
                                        />
                                        {errors.street && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.street}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.city} *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.city ? 'ring-2 ring-red-500/20' : ''}`}
                                            />
                                            {errors.city && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.city}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.state} *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.state ? 'ring-2 ring-red-500/20' : ''}`}
                                            />
                                            {errors.state && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.state}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-[#003B4A] uppercase tracking-widest ml-1">{t.zip_code} *</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className={`w-full px-6 py-4 bg-[#F9F7F2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20 text-[#003B4A] font-bold ${errors.zipCode ? 'ring-2 ring-red-500/20' : ''}`}
                                            />
                                            {errors.zipCode && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-gray-100">
                                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-10">{t.payment_method}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`flex items-center gap-4 p-6 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 ${formData.paymentMethod === 'credit-card' ? 'bg-[#003B4A] border-[#003B4A] text-white shadow-xl shadow-[#003B4A]/20' : 'bg-[#F9F7F2] border-transparent text-[#003B4A] hover:border-[#003B4A]/10'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit-card"
                                            checked={formData.paymentMethod === 'credit-card'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'credit-card' ? 'border-white' : 'border-[#003B4A]/20'}`}>
                                            {formData.paymentMethod === 'credit-card' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-xs">{t.credit_card}</span>
                                    </label>

                                    <label className={`flex items-center gap-4 p-6 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 ${formData.paymentMethod === 'debit-card' ? 'bg-[#003B4A] border-[#003B4A] text-white shadow-xl shadow-[#003B4A]/20' : 'bg-[#F9F7F2] border-transparent text-[#003B4A] hover:border-[#003B4A]/10'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="debit-card"
                                            checked={formData.paymentMethod === 'debit-card'}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'debit-card' ? 'border-white' : 'border-[#003B4A]/20'}`}>
                                            {formData.paymentMethod === 'debit-card' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-xs">{t.debit_card}</span>
                                    </label>
                                </div>

                                <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                    <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                        ⚠️ {t.demo_checkout}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 md:p-10 sticky top-28 border border-gray-100">
                                <h2 className="text-2xl font-black text-[#003B4A] mb-8 uppercase tracking-wider">{t.order_summary}</h2>

                                <div className="space-y-4 mb-8">
                                    {cartItems.map((item, index) => (
                                        <div key={item.variantId || item.id || index} className="flex justify-between items-start text-sm">
                                            <span className="text-gray-500 font-bold">
                                                {item.name} <span className="text-[#003B4A]/20 mx-1">×</span> {item.quantity}
                                            </span>
                                            <span className="font-black text-[#003B4A]">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#003B4A]/5 pt-8 space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                        <span>{t.subtotal}</span>
                                        <span className="text-[#003B4A]">{formatPrice(getCartSubtotal())}</span>
                                    </div>

                                    {/* Coupon Discount */}
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                                            <span>Coupon ({appliedCoupon.code})</span>
                                            <span>-{formatPrice(getCouponDiscount())}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                        <span>{t.tax} (8%)</span>
                                        <span className="text-[#003B4A]">{formatPrice(getCartTax())}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                        <span>{t.delivery_fee}</span>
                                        <span>
                                            {getDeliveryFee() === 0 ? (
                                                <span className="text-green-600 font-black">{t.free_delivery}</span>
                                            ) : (
                                                <span className="text-[#003B4A]">{formatPrice(getDeliveryFee())}</span>
                                            )}
                                        </span>
                                    </div>

                                    <div className="border-t border-[#003B4A]/5 pt-6">
                                        <div className="flex justify-between items-end">
                                            <span className="font-black text-[#003B4A] uppercase tracking-wider text-sm">{t.total}</span>
                                            <span className="text-3xl font-black text-green-600 leading-none">{formatPrice(getCartGrandTotal())}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Coupon Input */}
                                <div className="mb-6">
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                                            <div>
                                                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">{appliedCoupon.code}</p>
                                                <p className="text-xs text-emerald-600 font-medium">
                                                    {appliedCoupon.type === 'PERCENTAGE'
                                                        ? `${appliedCoupon.value}% off`
                                                        : `$${appliedCoupon.value} off`}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeCoupon}
                                                className="text-emerald-500 hover:text-red-500 transition-colors text-xs font-black uppercase"
                                            >Remove</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                                                Coupon Code
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                    placeholder="Enter code..."
                                                    className="flex-1 px-4 py-3 bg-[#F9F7F2] rounded-xl text-[#003B4A] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#003B4A]/20"
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon(couponInput))}
                                                />
                                                <button
                                                    type="button"
                                                    disabled={isCouponLoading || !couponInput.trim()}
                                                    onClick={() => applyCoupon(couponInput)}
                                                    className="px-4 py-3 bg-[#003B4A] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40"
                                                >
                                                    {isCouponLoading ? '...' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-red-500 text-xs font-bold">{couponError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#003B4A] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#003B4A]/90 transition-all shadow-xl shadow-[#003B4A]/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                >
                                    {isSubmitting ? 'Processing...' : t.place_order}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
