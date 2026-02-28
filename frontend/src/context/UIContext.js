"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within UIProvider');
    }
    return context;
};

export const UIProvider = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    // Global keyboard listener for CMD+K / CTRL+K
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleKeyDown = (e) => {
            // Open search on CMD+K / CTRL+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                // Prevent default browser behavior (e.g., focus address bar in some browsers)
                e.preventDefault();

                // Don't toggle if user is typing in an input (except search)
                const activeTag = document.activeElement.tagName;
                if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') {
                    // If it's the search overlay itself, maybe we want to allow closing?
                    // For now, let's just toggle normally as it's a global shortcut
                }

                toggleSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSearch]); // Use toggleSearch as dependency

    const value = {
        isSearchOpen,
        openSearch,
        closeSearch,
        toggleSearch
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};
