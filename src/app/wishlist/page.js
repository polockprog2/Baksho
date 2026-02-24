"use client";

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/helpers';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (product) => {
        addToCart(product, 1);
        removeFromWishlist(product.id);
    };

    if (getWishlistCount() === 0) {
        return (
            <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-[#003B4A] mb-2">Your Wishlist is Empty</h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Save your favourite products here so you never lose track of what you love.
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-[#003B4A] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F7F2] py-10 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#003B4A]">My Wishlist</h1>
                    <p className="text-gray-500 text-sm mt-1">{getWishlistCount()} saved {getWishlistCount() === 1 ? 'item' : 'items'}</p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {wishlistItems.map((product) => {
                        const discountedPrice = product.discount > 0
                            ? product.price * (1 - product.discount / 100)
                            : product.price;

                        const imgSrc = product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400';

                        return (
                            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                                {/* Image */}
                                <div className="relative aspect-square p-4">
                                    <Link href={`/products/${product.id}`}>
                                        <Image
                                            src={imgSrc}
                                            alt={product.name}
                                            fill
                                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 50vw, 25vw"
                                        />
                                    </Link>
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors z-10"
                                        aria-label="Remove from wishlist"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="p-3 flex flex-col flex-grow border-t border-gray-50">
                                    <Link href={`/products/${product.id}`}>
                                        <h3 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug mb-2 hover:text-green-600 transition-colors">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto">
                                        {product.discount > 0 && (
                                            <div className="text-[10px] text-gray-400 line-through">{formatPrice(product.price)}</div>
                                        )}
                                        <div className="text-sm font-black text-gray-900 mb-2">{formatPrice(discountedPrice)}</div>

                                        {product.inStock ? (
                                            <button
                                                onClick={() => handleMoveToCart(product)}
                                                className="w-full bg-[#003B4A] text-white text-[11px] font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
                                            >
                                                Move to Cart
                                            </button>
                                        ) : (
                                            <div className="w-full text-center text-[11px] font-bold text-gray-400 py-2 bg-gray-50 rounded-lg">
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Continue Shopping */}
                <div className="mt-10 text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-[#003B4A] font-bold text-sm hover:underline"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
