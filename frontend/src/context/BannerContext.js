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

    const addBanner = async (banner) => {
        try {
            const response = await fetch(`${API_BASE_URL}/banners`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(banner)
            });
            if (response.ok) {
                const newBanner = await response.json();
                setBanners(prev => [...prev, newBanner]);
            }
        } catch (error) {
            console.error('Add banner error:', error);
        }
    };

    const updateBanner = async (id, updatedFields) => {
        try {
            const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields)
            });
            if (response.ok) {
                const updatedBanner = await response.json();
                setBanners(prev => prev.map(banner =>
                    banner.id === id ? updatedBanner : banner
                ));
            }
        } catch (error) {
            console.error('Update banner error:', error);
        }
    };

    const deleteBanner = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setBanners(prev => prev.filter(banner => banner.id !== id));
            }
        } catch (error) {
            console.error('Delete banner error:', error);
        }
    };

    const toggleBannerStatus = async (id) => {
        const banner = banners.find(b => b.id === id);
        if (!banner) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !banner.active })
            });
            if (response.ok) {
                const updatedBanner = await response.json();
                setBanners(prev => prev.map(b =>
                    b.id === id ? updatedBanner : b
                ));
            }
        } catch (error) {
            console.error('Toggle banner error:', error);
        }
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
