import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { formatPrice } from '@/utils/helpers';
import { useState } from 'react';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;
    const [imgError, setImgError] = useState(false);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(item.variantId);
        } else {
            updateQuantity(item.variantId, newQuantity);
        }
    };

    return (
        <div className="flex gap-6 p-5 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Product Image */}
            <div className="w-24 h-24 bg-[#F9F7F2] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden p-2 relative">
                {item.image && !imgError ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain drop-shadow-lg"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="text-4xl">
                        {item.category === 'vegetables' && '🥬'}
                        {item.category === 'fruits' && '🍎'}
                        {item.category === 'meat-fish' && '🥩'}
                        {item.category === 'dairy' && '🥛'}
                        {item.category === 'packaged-food' && '🍝'}
                        {item.category === 'household' && '🧹'}
                        {!['vegetables', 'fruits', 'meat-fish', 'dairy', 'packaged-food', 'household'].includes(item.category) && '🛒'}
                    </div>
                )}
            </div>


            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-[#003B4A] text-lg mb-1">{item.name}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.unit || `1 ${t.unit_weight.split(':')[0]}`}</p>
                <p className="text-xl font-black text-green-600 mt-2">{formatPrice(item.price)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col items-end justify-between py-1">
                <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                    aria-label="Remove item"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                <div className="flex items-center gap-4 bg-[#F9F7F2] p-1 rounded-full border border-gray-100">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white text-[#003B4A] shadow-sm hover:bg-[#003B4A] hover:text-white transition-all flex items-center justify-center font-black text-lg"
                    >
                        -
                    </button>
                    <span className="w-6 text-center font-black text-[#003B4A]">{item.quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white text-[#003B4A] shadow-sm hover:bg-[#003B4A] hover:text-white transition-all flex items-center justify-center font-black text-lg"
                    >
                        +
                    </button>
                </div>

                <p className="text-sm font-black text-gray-400 mt-2">
                    {formatPrice(item.price * item.quantity)}
                </p>
            </div>
        </div>
    );
}
