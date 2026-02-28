"use client";

import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import { useUI } from "@/context/UIContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

/**
 * LayoutContent Component
 * Handles client-side layout elements that require context
 */
export default function LayoutContent({ children }) {
    const { isSearchOpen, closeSearch } = useUI();
    const { closeCart } = useCart();
    const { user } = useUser();

    // Close cart drawer on logout
    React.useEffect(() => {
        if (!user) {
            closeCart();
        }
    }, [user, closeCart]);

    return (
        <>
            <Navbar />
            <CartDrawer />
            <SearchOverlay isOpen={isSearchOpen} onClose={closeSearch} />
            <main>{children}</main>
            <Footer />
        </>
    );
}
