"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { formatPrice } from '@/utils/helpers';

/**
 * CartDrawer Component
 * A premium off-canvas shopping cart with glassmorphism and smooth transitions
 */
export default function CartDrawer() {
    const router = useRouter();
    const { user } = useUser();
    const {
        cartItems,
        isCartOpen,
        closeCart,
        updateQuantity,
        removeFromCart,
        getCartSubtotal,
        getCartTax,
        getDeliveryFee,
        getCartGrandTotal
    } = useCart();

    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const drawerRef = useRef(null);
    const [mounted, setMounted] = React.useState(false);

    // Handle mount state for hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isCartOpen && mounted) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen, mounted]);

    // Handle click outside to close
    const handleBackdropClick = (e) => {
        if (drawerRef.current && !drawerRef.current.contains(e.target)) {
            closeCart();
        }
    };

    const handleCheckout = () => {
        closeCart();
        if (user) {
            router.push('/checkout');
        } else {
            router.push('/login?redirect=/checkout');
        }
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out ${isCartOpen ? 'visible' : 'invisible'}`}
            onMouseDown={handleBackdropClick}
        >
            {/* Backdrop Overlay */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} />

            {/* Side Drawer Content */}
            <div
                ref={drawerRef}
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-out border-l border-gray-100 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Drawer Header */}
                <div className="p-4 md:p-6 border-b border-gray-50 flex items-center justify-between bg-[#F9F7F2]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#003B4A] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-[#003B4A] tracking-tighter uppercase">{t.cart_summary}</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors text-gray-400 hover:text-red-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Content (Scrollable List) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <span className="text-6xl">🛒</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#003B4A] mb-2">{t.cart_empty}</h3>
                            <p className="text-gray-400 mb-8 max-w-[200px]">{t.cart_empty_desc}</p>
                            <button
                                onClick={closeCart}
                                className="bg-[#003B4A] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
                            >
                                {t.browse_products}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={item.variantId || item.id || index} className="flex gap-4 group">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 p-1 group-hover:scale-105 transition-transform">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <h4 className="font-bold text-[#003B4A] text-sm leading-tight mb-1 line-clamp-1">{item.name}</h4>
                                                <p className="text-xs text-gray-400 font-medium">{t.cart_unit_prefix} {item.unit || t.cart_unit_default}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.variantId)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm font-black text-[#003B4A] hover:bg-[#003B4A] hover:text-white transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-black text-[#003B4A] min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm font-black text-[#003B4A] hover:bg-[#003B4A] hover:text-white transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-[#003B4A]">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Drawer Footer (Summary & Checkout) */}
                {cartItems.length > 0 && (
                    <div className="p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-medium">{t.cart_subtotal}</span>
                                <span className="text-[#003B4A] font-bold">{formatPrice(getCartSubtotal())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-medium">{t.cart_tax}</span>
                                <span className="text-[#003B4A] font-bold">{formatPrice(getCartTax())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-medium">{t.cart_delivery}</span>
                                <span className={`${getDeliveryFee() === 0 ? 'text-green-500' : 'text-[#003B4A]'} font-bold`}>
                                    {getDeliveryFee() === 0 ? t.free : formatPrice(getDeliveryFee())}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-lg font-black text-[#003B4A] uppercase tracking-tighter">{t.cart_total}</span>
                                <span className="text-2xl font-black text-green-600 tracking-tighter">{formatPrice(getCartGrandTotal())}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#003B4A] text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
                            >
                                {t.checkout || 'Complete Order'}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                onClick={closeCart}
                                className="w-full text-center py-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#003B4A] transition-colors"
                            >
                                {t.cart_continue_shopping}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Styles for Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}</style>
        </div>
    );
}
