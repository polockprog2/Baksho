"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/utils/helpers';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

/**
 * ProductCard Component - Enhanced UX
 * Features: Smooth interactions, better visual hierarchy, professional styling
 */
export default function ProductCard({ product, badgeType = null }) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [isAdding, setIsAdding] = useState(false);
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const mainVariant = product.variants?.[0];
        if (!mainVariant) return;

        setIsAdding(true);
        addToCart({
            ...product,
            variantId: mainVariant.id,
            price: mainVariant.price,
            name: `${product.name} (${mainVariant.name})`,
            image: product.images?.[0]?.imageUrl || product.image
        }, 1);
        setTimeout(() => setIsAdding(false), 1200);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const mainVariant = product.variants?.[0] || {};
    const mainImage = product.images?.[0]?.imageUrl || product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400';

    const price = mainVariant.price || 0;
    const originalPrice = mainVariant.originalPrice || 0;
    const inStock = mainVariant.stock > 0;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    // Determine badge - Jamoona style badges are simple rectangles
    const getBadge = () => {
        if (badgeType === 'weekly-deal') {
            return { text: t.cat_weekly_deals, className: 'bg-red-600' };
        }
        if (badgeType === 'value-deal' || discount >= 20) {
            return { text: t.cat_value_deals, className: 'bg-amber-500' };
        }
        if (discount > 0) {
            return { text: `–${discount}%`, className: 'bg-green-600' };
        }
        return null;
    };

    const badge = getBadge();

    const [imgSrc, setImgSrc] = useState(mainImage);

    return (
        <div className="group bg-white rounded-xl border border-gray-100 hover:border-green-200 transition-all duration-300 flex flex-col h-full overflow-hidden hover:shadow-lg">
            {/* Image Section */}
            <div className="relative">
                <Link href={`/products/${product.id}`} className="block relative aspect-square p-4 bg-white overflow-hidden">
                    {badge && (
                        <div className={`absolute top-0 left-0 z-10 ${badge.className} text-white text-[10px] font-bold py-1 px-2 uppercase tracking-wider`}>
                            {badge.text}
                        </div>
                    )}

                    <div className="w-full h-full relative">
                        <Image
                            src={imgSrc}
                            alt={product.name}
                            fill
                            className={`object-contain transition-transform duration-500 group-hover:scale-105 ${!inStock ? 'grayscale opacity-40' : ''}`}
                            sizes="(max-width: 768px) 50vw, 20vw"
                            onError={() => setImgSrc('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400')}
                        />
                    </div>

                    {!inStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                            <span className="bg-gray-800 text-white text-[10px] font-bold px-3 py-1 rounded truncate">
                                {t.sold_out}
                            </span>
                        </div>
                    )}
                </Link>

                {/* Wishlist Heart Button */}
                <button
                    onClick={handleToggleWishlist}
                    className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full shadow-sm border transition-all duration-200 ${isInWishlist(product.id)
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white border-gray-200 text-gray-300 hover:text-red-400 hover:border-red-200'
                        }`}
                    aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <svg className="w-4 h-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col flex-grow border-t border-gray-50">
                <div className="mb-1">
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
                        {mainVariant.name || 'Default'}
                    </span>
                </div>

                <Link href={`/products/${product.id}`} className="mb-2 block">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors h-10">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating - subtle */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 4.5) ? 'text-amber-400 fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400">({product.reviewsCount || 0})</span>
                </div>

                {/* Price & Add To Cart */}
                <div className="mt-auto flex items-end justify-between">
                    <div>
                        {discount > 0 && (
                            <div className="text-[10px] text-gray-400 line-through font-medium">
                                {formatPrice(originalPrice)}
                            </div>
                        )}
                        <div className="text-lg font-bold text-gray-900 leading-none">
                            {formatPrice(price)}
                        </div>
                    </div>

                    {inStock && (
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg shadow-sm border transition-all duration-300 ${isAdding
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'bg-white border-gray-200 text-green-600 hover:bg-green-600 hover:border-green-600 hover:text-white'
                                }`}
                            aria-label="Add to cart"
                        >
                            {isAdding ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" /></svg>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
