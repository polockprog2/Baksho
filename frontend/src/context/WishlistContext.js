"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { getWishlist, addToWishlistApi, removeFromWishlistApi } from '@/api/wishlist.api';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { user } = useUser();
    const [wishlistItems, setWishlistItems] = useState([]); // array of product-like objects
    const [isLoading, setIsLoading] = useState(false);

    const LOCAL_KEY = 'wishlist_guest';

    // Load wishlist: from backend for logged-in users, localStorage for guests
    useEffect(() => {
        const loadWishlist = async () => {
            if (user?.id) {
                setIsLoading(true);
                try {
                    const data = await getWishlist();
                    // items from API are { id, wishlistId, productId, createdAt }
                    // Convert them to a simpler structure with productId
                    const ids = (data.items || []).map(item => ({ id: item.productId }));
                    setWishlistItems(ids);
                } catch {
                    setWishlistItems([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Guest: load from localStorage
                try {
                    const saved = localStorage.getItem(LOCAL_KEY);
                    setWishlistItems(saved ? JSON.parse(saved) : []);
                } catch {
                    setWishlistItems([]);
                }
            }
        };
        loadWishlist();
    }, [user?.id]);

    // Persist guest wishlist to localStorage
    useEffect(() => {
        if (!user?.id && typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_KEY, JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, user?.id]);

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId || item.productId === productId);
    };

    const addToWishlist = async (product) => {
        // Optimistic update
        setWishlistItems(prev => {
            if (isInWishlist(product.id)) return prev;
            return [...prev, { id: product.id, ...product }];
        });

        if (user?.id) {
            try {
                await addToWishlistApi(product.id);
            } catch {
                // Revert on error
                setWishlistItems(prev => prev.filter(item => (item.id || item.productId) !== product.id));
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        // Optimistic update
        setWishlistItems(prev => prev.filter(item => (item.id || item.productId) !== productId));

        if (user?.id) {
            try {
                await removeFromWishlistApi(productId);
            } catch {
                // Could revert here, but we keep it simple
            }
        }
    };

    const toggleWishlist = async (product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    };

    const getWishlistCount = () => wishlistItems.length;

    const value = {
        wishlistItems,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        getWishlistCount,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
