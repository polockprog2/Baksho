"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartItem from '@/components/CartItem';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { formatPrice } from '@/utils/helpers';

export default function CartPage() {
    const router = useRouter();
    const { cartItems, getCartSubtotal, getCartTax, getDeliveryFee, getCartGrandTotal } = useCart();
    const { user } = useUser();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const handleCheckout = () => {
        if (user) {
            router.push('/checkout');
        } else {
            router.push('/login');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] py-20">
                <div className="max-w-xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center border border-gray-100">
                        <div className="text-8xl mb-8">🛒</div>
                        <h2 className="text-3xl font-black text-[#003B4A] mb-4">{t.cart_empty}</h2>
                        <p className="text-gray-500 mb-10 font-medium">
                            {t.cart_empty_desc}
                        </p>
                        <Link href="/products" className="inline-block bg-[#003B4A] text-white px-10 py-4 rounded-2xl font-black hover:bg-[#003B4A]/90 transition-all shadow-xl shadow-[#003B4A]/10 active:scale-95">
                            {t.start_shopping}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-[#003B4A] mb-10">{t.shopping_cart}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item, index) => (
                            <CartItem key={item.variantId || item.id || index} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sticky top-28 border border-gray-100">
                            <h2 className="text-2xl font-black text-[#003B4A] mb-8">{t.order_summary}</h2>

                            <div className="space-y-5 mb-8">
                                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                                    <span>{t.subtotal}</span>
                                    <span className="text-[#003B4A]">{formatPrice(getCartSubtotal())}</span>
                                </div>

                                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                                    <span>{t.tax} (8%)</span>
                                    <span className="text-[#003B4A]">{formatPrice(getCartTax())}</span>
                                </div>

                                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                                    <span>{t.delivery_fee}</span>
                                    <span>
                                        {getDeliveryFee() === 0 ? (
                                            <span className="text-green-600 font-black">{t.free}</span>
                                        ) : (
                                            <span className="text-[#003B4A]">{formatPrice(getDeliveryFee())}</span>
                                        )}
                                    </span>
                                </div>

                                {getCartSubtotal() < 50 && (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                        <p className="text-xs text-emerald-800 font-bold text-center">
                                            {t.add_more_for_free.replace('{{amount}}', formatPrice(50 - getCartSubtotal()))}
                                        </p>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex justify-between text-2xl font-black text-[#003B4A]">
                                        <span>{t.total}</span>
                                        <span className="text-green-600">{formatPrice(getCartGrandTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#003B4A] text-white font-black py-5 rounded-2xl hover:bg-[#003B4A]/90 active:scale-[0.98] transition-all shadow-xl shadow-[#003B4A]/10 text-lg uppercase tracking-widest"
                            >
                                {t.proceed_checkout}
                            </button>

                            <Link
                                href="/products"
                                className="block text-center mt-6 text-gray-500 hover:text-[#003B4A] font-black text-sm uppercase tracking-widest transition-colors"
                            >
                                {t.continue_shopping}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
