"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';
import DealsCarousel from '@/components/DealsCarousel';
import ProductCard from '@/components/ProductCard';
import AdvancedCategoryCard from '@/components/AdvancedCategoryCard';
import TrustSection from '@/components/TrustSection';
import BannerSection from '@/components/BannerSection';
import CategoryProductSection from '@/components/CategoryProductSection';
import FloatingSupport from '@/components/FloatingSupport';
import { getProducts, getCategories } from '@/api/product.api';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import SkeletonCard from '@/components/SkeletonCard';

/**
 * Professional & Unique Home Page
 */
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [weeklyDeals, setWeeklyDeals] = useState([]);
  const [valueDeals, setValueDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        const [featuredRes, newArrivalsRes, dealsRes, categoriesRes] = await Promise.all([
          getProducts({ featured: true, limit: 8 }),
          getProducts({ sort: 'newest', limit: 8 }),
          getProducts({ discount: true, limit: 16 }),
          getCategories()
        ]);

        setFeaturedProducts(featuredRes.data || featuredRes);
        setNewArrivals(newArrivalsRes.data || newArrivalsRes);
        const deals = dealsRes.data || dealsRes;
        setWeeklyDeals(deals.slice(0, 8));
        setValueDeals(deals.slice(8, 16));
        setCategories(categoriesRes.data || categoriesRes);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-slate-50/30 to-white relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-green-200/30 via-emerald-200/20 to-transparent rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/20 via-green-200/10 to-transparent rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      {/* 1. HERO BANNER */}
      <div className="relative z-10">
        <HeroBanner />
      </div>



      {/* 3. WEEKLY DEALS - ENHANCED */}
      {weeklyDeals.length > 0 && (
        <section className="relative z-10 py-24 bg-gradient-to-br from-green-50/60 via-white to-emerald-50/40 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-green-300/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-emerald-300/10 rounded-full blur-3xl animate-blob"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Badge */}
            <div className="mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/80 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">⚡ Hot Deals Live</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  {t.cat_weekly_deals}
                </h2>
                <p className="text-lg text-gray-600 font-medium max-w-xl">
                  🔥 Limited time offers on premium fresh groceries. Save big while stocks last!
                </p>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <Link href="/deals/weekly" className="group relative inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                <span>Explore Deals</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <DealsCarousel
              title=""
              products={weeklyDeals}
              badgeType="weekly-deal"
              isLoading={isDataLoading}
            />
          </div>
        </section>
      )}

      {/* 4. VALUE DEALS - ENHANCED */}
      {valueDeals.length > 0 && (
        <section className="relative z-10 py-24 bg-white overflow-hidden">
          {/* Side Decoration */}
          <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-cyan-200/10 rounded-full blur-3xl animate-blob animation-delay-3000"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Badge */}
            <div className="mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/80 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-pulse inline-flex h-full w-full rounded-full bg-blue-600"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">💎 Best Value</span>
              </div>
              <div className="space-y-3">
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  {t.cat_value_deals}
                </h2>
                <p className="text-lg text-gray-600 font-medium max-w-xl">
                  💰 Premium quality products at unbeatable prices. Smart savings for smart shoppers!
                </p>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <Link href="/deals/value" className="group relative inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                <span>Shop Value Deals</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <DealsCarousel
              title=""
              products={valueDeals}
              badgeType="value-deal"
              isLoading={isDataLoading}
            />
          </div>
        </section>
      )}

      {/* 5. PROMOTIONAL BANNERS */}
      <div className="relative z-10">
        <BannerSection />
      </div>

      {/* 6. ADVANCED CATEGORY SECTION */}
      <section className="relative z-10 py-28 overflow-hidden">
        {/* Background with Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-200/20 via-emerald-200/10 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-tl from-blue-200/15 via-green-200/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/2 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
              {t.shop_by_category}
            </h2>
            <div className="flex justify-center mb-6">
              <div className="relative h-1.5 w-32 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-sm animate-pulse"></div>
              </div>
            </div>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated collections and find exactly what you need
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-5 mb-8">
            {categories.slice(0, 16).map((category, index) => (
              <AdvancedCategoryCard key={category.id} category={category} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-8">
            <Link href="/categories" className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                {t.view_all_categories || 'View All Categories'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CATEGORY PRODUCT SECTIONS */}
      <div className="relative z-10">
        {categories.filter(cat => ['vegetables', 'fruits', 'meat-fish', 'bakery', 'dairy'].includes(cat.slug)).map((category, index) => (
          <CategoryProductSection
            key={category.id}
            category={category}
            title={index === 0 ? `Fresh ${category.name}` : category.name}
          />
        ))}
      </div>

      {/* 8. FEATURED PRODUCTS - PREMIUM LAYOUT */}
      <section className="relative z-10 py-32 bg-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-br from-green-200/30 via-emerald-200/20 to-transparent rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 -left-20 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-green-700">Top Rated</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  {t.featured_products}
                </h2>
              </div>

              <div className="h-1 w-20 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full"></div>

              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                {t.top_rated_items || 'Handpicked premium items from our finest suppliers.'}
              </p>

              {/* Features */}
              <div className="space-y-3 pt-6">
                {[
                  { icon: '✨', text: 'Hand-picked premium items' },
                  { icon: '⭐', text: '5-star customer ratings' },
                  { icon: '🚚', text: 'Same-day delivery available' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="text-2xl flex-shrink-0 group-hover:scale-125 transition-transform duration-300">{item.icon}</div>
                    <div className="text-gray-700 font-semibold group-hover:text-green-600 transition-colors">{item.text}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link href="/products" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-sm uppercase rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 overflow-hidden tracking-widest">
                  <span className="relative z-10 flex items-center gap-2">
                    {t.view_all || 'Explore All'}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0"></div>
                </Link>
              </div>
            </div>

            {/* Right Products Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {isDataLoading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <SkeletonCard />
                    </div>
                  ))
                ) : (
                  featuredProducts.slice(0, 6).map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in-up hover:z-20"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 rounded-2xl"></div>
                        <ProductCard product={product} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8.5 NEW ARRIVALS - COMPACT & DYNAMIC */}
      {newArrivals.length > 0 && (
        <section className="relative z-10 py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                  ✨ Just Landed
                </div>
                <h2 className="text-4xl font-black text-gray-900">{t.new_arrivals || 'New Arrivals'}</h2>
              </div>
              <Link href="/products?sort=newest" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-blue-600 pb-1">
                {t.view_all || 'View All'}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {isDataLoading ? (
                [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
              ) : (
                newArrivals.slice(0, 4).map((product, index) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. TRUST SECTION */}
      <div className="relative z-10">
        <TrustSection />
      </div>

      {/* 10. PREMIUM CTA SECTION */}
      <section className="relative z-10 py-28 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

          {/* Animated Blobs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Light tunnel effect */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="group relative">
            {/* Glass Morphism Card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-700 rounded-3xl"></div>

            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/2 backdrop-blur-3xl border border-white/20 rounded-3xl p-12 md:p-20 shadow-2xl overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>

              {/* Content */}
              <div className="text-center space-y-10">
                {/* Badge with Pulse */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 backdrop-blur-sm hover:border-green-400 transition-all">
                  <span className="flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300">
                    🎉 Limited Time Offer
                  </span>
                </div>

                {/* Main Heading with Gradient */}
                <div className="space-y-4">
                  <h2 className="text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    {t.ready_to_shop || 'Ready to Shop?'}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 font-semibold max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                    {t.join_customers || 'Join thousands of happy customers enjoying fresh groceries delivered to their doorstep.'}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
                  {/* Primary CTA */}
                  <Link
                    href="/products"
                    className="group/btn relative px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-400 text-slate-900 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:shadow-green-500/50 transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t.browse_products || 'Shop Now'}
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                  </Link>

                  {/* Secondary CTA */}
                  <Link
                    href="/register"
                    className="px-12 py-4 bg-white/10 text-white border-2 border-white/40 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 hover:border-white/60 transition-all duration-500 hover:scale-105 active:scale-95 backdrop-blur-md group/btn2"
                  >
                    <span className="flex items-center gap-2">
                      {t.sign_up || 'Join Free'}
                      <span className="group-hover/btn2:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10">
                  {[
                    { value: '50K+', label: '👥 Happy Customers', color: 'from-green-400' },
                    { value: '99%', label: '✅ Fresh Products', color: 'from-emerald-400' },
                    { value: '24hrs', label: '🚚 Fast Delivery', color: 'from-cyan-400' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2 group/stat hover:scale-110 transition-transform duration-300">
                      <div className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${item.color} to-white`}>
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-300 font-semibold">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>

              {/* Floating Decorative Icon */}
              <div className="absolute -top-20 -right-20 opacity-10 pointer-events-none scale-150 group-hover:scale-[1.65] transition-transform duration-700">
                <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FLOATING SUPPORT */}
      <div className="relative z-10">
        <FloatingSupport />
      </div>

      {/* Custom Animations in styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease-out forwards;
          opacity: 0;
        }

        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}