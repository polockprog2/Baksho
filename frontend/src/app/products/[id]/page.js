"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { getProductById } from '@/api/product.api';
import { formatPrice } from '@/utils/helpers';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProductById(params.id);
                if (product) {
                    setProduct(product);
                    if (product.variants?.length > 0) {
                        setSelectedVariant(product.variants[0]);
                    }
                    // Fetch related products
                    const allProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products?limit=100`)
                        .then(r => r.json())
                        .then(res => res.data || res)
                        .catch(() => []);
                    const related = allProducts
                        .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
                        .slice(0, 4);
                    setRelatedProducts(related);
                } else {
                    setError(t.product_not_found);
                }
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError(t.product_not_found);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [params.id, t.product_not_found]);

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        setIsAdding(true);
        addToCart({
            ...product,
            variantId: selectedVariant.id,
            price: selectedVariant.price,
            name: `${product.name} (${selectedVariant.name})`,
            image: product.images?.[0]?.imageUrl || product.image
        }, quantity);
        setTimeout(() => setIsAdding(false), 1000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
                <LoadingSpinner size="lg" text={t.loading_product} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-[#F9F7F2]">
                <ErrorMessage
                    message={error || t.product_not_found}
                    onRetry={() => router.push('/products')}
                />
            </div>
        );
    }

    const mainImage = product.images?.[0]?.imageUrl || product.image;

    return (
        <div className="bg-[#F9F7F2] min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-400 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    <Link href="/" className="hover:text-[#003B4A] transition-colors">{t.home}</Link>
                    <span className="text-[#003B4A]/20">/</span>
                    <Link href="/products" className="hover:text-[#003B4A] transition-colors">{t.products}</Link>
                    <span className="text-[#003B4A]/20">/</span>
                    <span className="text-[#003B4A]">{product.name}</span>
                </nav>

                {/* Product Details Card */}
                <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-20 border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Product Image Section */}
                        <div className="relative group">
                            <div className="aspect-square bg-[#F9F7F2] rounded-[2.5rem] flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-105 overflow-hidden p-8 relative">
                                {mainImage ? (
                                    <Image
                                        src={mainImage}
                                        alt={product.name}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                ) : (
                                    <div className="text-[12rem]">
                                        {product.category?.slug === 'vegetables' && '🥬'}
                                        {product.category?.slug === 'fruits' && '🍎'}
                                        {product.category?.slug === 'meat-fish' && '🥩'}
                                        {product.category?.slug === 'dairy' && '🥛'}
                                        {product.category?.slug === 'packaged-food' && '🍝'}
                                        {product.category?.slug === 'household' && '🧹'}
                                    </div>
                                )}
                            </div>

                            {selectedVariant?.originalPrice > selectedVariant?.price && (
                                <div className="absolute top-6 right-6 bg-red-500 text-white px-6 py-2 rounded-full text-xl font-black shadow-xl shadow-red-500/20">
                                    {Math.round(((selectedVariant.originalPrice - selectedVariant.price) / selectedVariant.originalPrice) * 100)}% {t.off}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl md:text-5xl font-black text-[#003B4A] mb-4 leading-tight">{product.name}</h1>

                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(product.rating || 4.5) ? 'text-yellow-400' : 'text-gray-200'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 font-black text-[#003B4A]">{product.rating || 4.5}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    {product.reviewsCount || 0} {t.reviews_label}
                                </span>
                            </div>

                            {/* Variant Selection */}
                            <div className="mb-10">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t.select_variant || 'Select Size/Option'}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants?.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 border-2 ${selectedVariant?.id === v.id
                                                ? 'bg-[#003B4A] border-[#003B4A] text-white shadow-lg shadow-[#003B4A]/20'
                                                : 'bg-white border-gray-100 text-[#003B4A] hover:border-[#003B4A]/10'
                                                }`}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing and Unit */}
                            <div className="flex items-end gap-6 mb-10">
                                <div className="flex flex-col">
                                    <span className="text-5xl font-black text-green-600">{formatPrice(selectedVariant?.price || 0)}</span>
                                </div>
                                {selectedVariant?.originalPrice > selectedVariant?.price && (
                                    <span className="text-2xl text-gray-300 line-through font-bold mb-1">{formatPrice(selectedVariant.originalPrice)}</span>
                                )}
                            </div>

                            {/* Stock Status Badges */}
                            <div className="mb-10">
                                {selectedVariant?.stock > 0 ? (
                                    <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full font-black uppercase text-xs tracking-widest border border-emerald-100">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                        {t.in_stock}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2 rounded-full font-black uppercase text-xs tracking-widest border border-red-100">
                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                        {t.out_of_stock}
                                    </span>
                                )}
                            </div>

                            {/* Description Section */}
                            <div className="mb-12">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t.description}</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
                            </div>

                            {/* Order Controls */}
                            {selectedVariant?.stock > 0 && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{t.quantity}</h3>
                                        <div className="flex items-center gap-6 bg-[#F9F7F2] w-fit p-1.5 rounded-full border border-gray-100">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 rounded-full bg-white text-[#003B4A] shadow-md hover:bg-[#003B4A] hover:text-white transition-all duration-300 flex items-center justify-center font-black text-2xl"
                                            >
                                                -
                                            </button>
                                            <span className="text-2xl font-black text-[#003B4A] w-12 text-center">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-12 rounded-full bg-white text-[#003B4A] shadow-md hover:bg-[#003B4A] hover:text-white transition-all duration-300 flex items-center justify-center font-black text-2xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={selectedVariant.stock <= 0 || isAdding}
                                            className={`flex-1 py-5 px-10 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-300 shadow-xl ${selectedVariant.stock > 0
                                                ? isAdding
                                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20 scale-[0.98]'
                                                    : 'bg-[#003B4A] text-white hover:bg-[#003B4A]/90 shadow-[#003B4A]/20 active:scale-[0.98]'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            {isAdding ? `✓ ${t.added_to_cart}` : selectedVariant.stock > 0 ? t.add_to_cart : t.out_of_stock}
                                        </button>

                                        <Link href="/cart" className="sm:w-fit px-10 py-5 bg-white border-2 border-[#003B4A] text-[#003B4A] rounded-2xl font-black text-center text-lg uppercase tracking-widest hover:bg-[#003B4A] hover:text-white transition-all duration-300 active:scale-[0.98]">
                                            {t.view_cart}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-black text-[#003B4A] uppercase tracking-wider">{t.related_products}</h2>
                            <Link href="/products" className="text-green-600 font-black uppercase text-sm tracking-widest hover:underline transition-all underline-offset-8">
                                {t.view_all} →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct, index) => (
                                <div key={relatedProduct.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <ProductCard product={relatedProduct} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
