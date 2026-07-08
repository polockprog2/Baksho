"use client";

import Link from 'next/link';
import dynamic from 'next/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import HeroBanner from '@/components/HeroBanner';
import DealsCarousel from '@/components/DealsCarousel';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import BannerSection from '@/components/BannerSection';
import CategoryProductSection from '@/components/CategoryProductSection';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

// Lazy load non-critical sections
const TrustSection = dynamic(() => import('@/components/TrustSection'), { ssr: true });
const FloatingSupport = dynamic(() => import('@/components/FloatingSupport'), { ssr: false });

export default function HomeContent({ 
  initialData 
}) {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  // Embla carousel instances for inline product rows
  const [featuredEmblaRef] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' });
  const [newArrivalsEmblaRef] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' });

  const { 
    featuredProducts, 
    newArrivals, 
    weeklyDeals, 
    valueDeals, 
    categories, 
    homepageSettings 
  } = initialData;

  return (
    <div className="bg-gradient-to-b from-white via-slate-50/30 to-white relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-green-200/30 via-emerald-200/20 to-transparent rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/20 via-green-200/10 to-transparent rounded-full blur-3xl -translate-x-1/2"></div>
      </div>

      {/* 1. HERO BANNER */}
      <div className="relative z-10">
        <HeroBanner content={homepageSettings} />
      </div>

      {/* 3. WEEKLY DEALS */}
      {weeklyDeals.length > 0 && (
        <section className="relative z-10 py-24 md:py-32 bg-white overflow-hidden">
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-tl from-red-100/30 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
              <div className="lg:col-span-1 space-y-8 sticky top-32">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">{t.live_now || "LIVE: FLASH SALES"}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                    {t.weekly_deals_title || "Weekly Deals"}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  {t.weekly_deals_subtitle || "Exclusive flash sales on high-demand items. Refreshing every Monday morning."}
                </p>
                <div className="pt-4">
                  <Link href="/deals/weekly" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-red-700 hover:gap-5 transition-all group">
                    {t.view_all || "View All Deals"}
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-3">
                <DealsCarousel products={weeklyDeals} badgeType="weekly-deal" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. VALUE DEALS */}
      {valueDeals.length > 0 && (
        <section className="relative z-10 py-24 md:py-32 bg-[#F9F7F2] overflow-hidden">
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-green-100/30 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
              <div className="lg:col-span-1 space-y-8 sticky top-32">
                <div className="space-y-4">
                  <div className="h-1.5 w-16 bg-green-600 rounded-full"></div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                    {t.value_deals_title || "Value Deals"}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  {t.value_deals_subtitle || "Wallet-friendly prices on everyday staples. Smart savings for smart shoppers."}
                </p>
                <div className="pt-4">
                  <Link href="/deals/value" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-green-700 hover:gap-5 transition-all group">
                    {t.shop_deals || "Shop All Deals"}
                    <span className="group-hover:scale-125 transition-transform">→</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-3">
                <DealsCarousel products={valueDeals} badgeType="value-deal" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. PROMOTIONAL BANNERS */}
      <div className="relative z-10">
        <BannerSection />
      </div>

      {/* 6. Categories Section */}
      <section className="relative z-10 py-20 md:py-28 bg-gradient-to-br from-emerald-50/80 via-white to-green-50/60 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-green-300/10 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-emerald-300/15 rounded-full blur-3xl animate-blob pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-20 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200/80 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">🛒 Shop by Category</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
              Explore Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">Categories</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5 mb-14">
            {categories.slice(0, 18).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/categories" className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-emerald-500/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                View All Categories
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0" />
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

      {/* 8. FEATURED PRODUCTS */}
      <section className="relative z-10 py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
                  <span className="text-xs font-black uppercase tracking-widest text-green-700">Top Rated</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  {t.featured_products}
                </h2>
              </div>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                {t.top_rated_items || 'Handpicked premium items from our finest suppliers.'}
              </p>
              <div className="pt-4">
                <Link href="/products" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-sm uppercase rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 overflow-hidden tracking-widest">
                  <span className="relative z-10 flex items-center gap-2">
                    {t.view_all || 'Explore All'}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div ref={featuredEmblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                <div className="flex gap-6 pb-4 pt-2">
                  {featuredProducts.slice(0, 8).map((product, index) => (
                    <div key={product.id} className="flex-none w-[220px] animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8.5 NEW ARRIVALS */}
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
            <div ref={newArrivalsEmblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
              <div className="flex gap-6 pb-4 pt-2">
                {newArrivals.slice(0, 8).map((product, index) => (
                  <div key={product.id} className="flex-none w-[220px] animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. TRUST SECTION - Lazy Loaded */}
      <div className="relative z-10">
        <TrustSection />
      </div>

      {/* 10. PREMIUM CTA SECTION */}
      <section className="relative z-10 py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-green-500/30 to-emerald-500/20 rounded-full blur-3xl animate-blob"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/2 backdrop-blur-3xl border border-white/20 rounded-3xl p-12 md:p-20 shadow-2xl text-center space-y-10">
            <h2 className="text-6xl md:text-7xl font-black text-white leading-tight">
              {t.ready_to_shop || 'Ready to Shop?'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/products" className="px-12 py-4 bg-gradient-to-r from-green-400 to-emerald-400 text-slate-900 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-110 transition-all">
                {t.browse_products || 'Shop Now'}
              </Link>
              <Link href="/register" className="px-12 py-4 bg-white/10 text-white border-2 border-white/40 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                {t.sign_up || 'Join Free'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FLOATING SUPPORT - Lazy Loaded (Client only) */}
      <FloatingSupport />
    </div>
  );
}
