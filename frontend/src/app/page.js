import HomeContent from '@/components/HomeContent';
import { getProducts, getCategories } from '@/api/product.api';
import { getHomepageSettings } from '@/api/settings.api';
import { flattenProduct } from '@/utils/helpers';

/**
 * Professional & Unique Home Page - Server Component
 * Fetches data on the server to reduce client-side bundle and improve performance.
 */
export default async function Home() {
  // Fetch data on the server
  let initialData = {
    featuredProducts: [],
    newArrivals: [],
    weeklyDeals: [],
    valueDeals: [],
    categories: [],
    homepageSettings: {}
  };

  try {
    const [featuredRes, newArrivalsRes, dealsRes, categoriesRes, settingsRes] = await Promise.all([
      getProducts({ featured: true, limit: 8 }),
      getProducts({ sort: 'newest', limit: 8 }),
      getProducts({ discount: 'true', limit: 20 }),
      getCategories(),
      getHomepageSettings()
    ]);

    const featured = (featuredRes.data || featuredRes).map(flattenProduct);
    const newArr = (newArrivalsRes.data || newArrivalsRes).map(flattenProduct);
    const allDeals = (dealsRes.data || dealsRes).map(flattenProduct);
    
    initialData = {
      featuredProducts: featured,
      newArrivals: newArr,
      weeklyDeals: allDeals.filter(p => (p.discount || 0) >= 15).slice(0, 10),
      valueDeals: allDeals.slice(0, 10),
      categories: categoriesRes.data || categoriesRes,
      homepageSettings: settingsRes || {}
    };
  } catch (error) {
    console.error('Failed to fetch homepage data on server:', error);
  }

  return <HomeContent initialData={initialData} />;
}