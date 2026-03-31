"use client";

import { createContext, useContext, useState, useEffect } from 'react';
// import { initialBanners } from '@/data/banners'; // Removed static data dependency

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BannerContext = createContext();

export function BannerProvider({ children }) {
    const [banners, setBanners] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load banners from API
    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsLoaded(true);
            return;
        }

        const fetchBanners = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/banners`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    const data = await response.json();
                    const bannersData = data.data || data;
                    setBanners(bannersData);
                    localStorage.setItem('baksho_banners', JSON.stringify(bannersData));
                } else {
                    // Fallback to localStorage if API fails
                    const savedBanners = localStorage.getItem('baksho_banners');
                    if (savedBanners) {
                        setBanners(JSON.parse(savedBanners));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                // Fallback to localStorage
                const savedBanners = localStorage.getItem('baksho_banners');
                if (savedBanners) {
                    setBanners(JSON.parse(savedBanners));
                }
            } finally {
                setIsLoaded(true);
            }
        };

        fetchBanners();
    }, []);

    // Save to localStorage whenever banners change
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem('baksho_banners', JSON.stringify(banners));
        }
    }, [banners, isLoaded]);

    const addBanner = (banner) => {
        const newBanner = {
            ...banner,
            id: Date.now(),
            active: true
        };
        setBanners(prev => [...prev, newBanner]);
    };

    const updateBanner = (id, updatedFields) => {
        setBanners(prev => prev.map(banner =>
            banner.id === id ? { ...banner, ...updatedFields } : banner
        ));
    };

    const deleteBanner = (id) => {
        setBanners(prev => prev.filter(banner => banner.id !== id));
    };

    const toggleBannerStatus = (id) => {
        setBanners(prev => prev.map(banner =>
            banner.id === id ? { ...banner, active: !banner.active } : banner
        ));
    };

    const getActiveBanners = () => {
        return banners.filter(banner => banner.active);
    };

    return (
        <BannerContext.Provider value={{
            banners,
            addBanner,
            updateBanner,
            deleteBanner,
            toggleBannerStatus,
            getActiveBanners,
            isLoaded
        }}>
            {children}
        </BannerContext.Provider>
    );
}

export const useBanners = () => {
    const context = useContext(BannerContext);
    if (!context) {
        throw new Error('useBanners must be used within a BannerProvider');
    }
    return context;
};
