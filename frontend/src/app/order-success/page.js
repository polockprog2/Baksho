"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { getOrderById } from '@/api/order.api';
import { formatPrice, formatDate } from '@/utils/helpers';

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F9F7F2] py-16 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003B4A] mx-auto mb-4"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
            </div>
        </div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderId = searchParams.get('orderId');
                if (orderId) {
                    const orderData = await getOrderById(orderId);
                    setOrder(orderData);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [searchParams, router]);

    if (isLoading || !order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[4rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-10 md:p-16 text-center border border-gray-100 relative overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F9F7F2] rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                        {/* Success Icon */}
                        <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/10 animate-bounce-subtle">
                            <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-[#003B4A] mb-6 leading-tight">{t.order_success_title}</h1>
                        <p className="text-xl text-gray-500 font-medium mb-12 max-w-xl mx-auto">
                            {t.order_success_desc}
                        </p>

                        {/* Order Summary Grid */}
                        <div className="bg-[#F9F7F2] rounded-[2.5rem] p-8 md:p-10 mb-12 border border-gray-100 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.order_number}</p>
                                    <p className="font-black text-[#003B4A] text-xl">{order.id}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.order_date}</p>
                                    <p className="font-bold text-[#003B4A]">{formatDate(order.date)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.estimated_delivery}</p>
                                    <p className="font-bold text-[#003B4A]">{formatDate(order.estimatedDelivery)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.total}</p>
                                    <p className="font-black text-3xl text-green-600">{formatPrice(order.total)}</p>
                                </div>
                            </div>

                            <div className="border-t border-[#003B4A]/5 pt-8">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{t.delivery_address}</p>
                                <p className="font-bold text-[#003B4A] text-lg leading-snug">
                                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                                </p>
                            </div>
                        </div>

                        {/* Order Items Section */}
                        <div className="text-left mb-12">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">{t.order_items}</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-50 shadow-sm transition-hover">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-[#F9F7F2] rounded-xl flex items-center justify-center text-3xl shadow-inner">
                                                🛒
                                            </div>
                                            <div>
                                                <p className="font-black text-[#003B4A]">{item.productName}</p>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.quantity}: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-[#003B4A]">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <Link href="/profile" className="bg-[#003B4A] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#003B4A]/90 transition-all shadow-xl shadow-[#003B4A]/20 active:scale-95">
                                {t.view_details}
                            </Link>
                            <Link href="/products" className="bg-white border-2 border-[#003B4A] text-[#003B4A] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#003B4A] hover:text-white transition-all duration-300 active:scale-95">
                                {t.continue_shopping}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
