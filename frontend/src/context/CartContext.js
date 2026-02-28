"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
        setIsLoading(false);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!isLoading && typeof window !== 'undefined') {
            try {
                localStorage.setItem('cart', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Failed to save cart to localStorage:', error);
                // Handle quota exceeded error or other storage issues
                if (error.name === 'QuotaExceededError') {
                    alert('Your shopping cart is too full to save locally. Please checkout soon!');
                }
            }
        }
    }, [cartItems, isLoading]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.variantId === product.variantId);

            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item.variantId === product.variantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                return [...prevItems, { ...product, quantity }];
            }
        });
        // Auto-open cart drawer when adding item
        setIsCartOpen(true);
    };

    // Remove item from cart
    const removeFromCart = (variantId) => {
        setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
    };

    // Update item quantity
    const updateQuantity = (variantId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(variantId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.variantId === variantId ? { ...item, quantity } : item
            )
        );
    };

    // Clear entire cart
    // In production, this would call: DELETE /api/cart
    const clearCart = () => {
        setCartItems([]);
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    // Calculate cart totals
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const getCartSubtotal = () => {
        return getCartTotal();
    };

    const getCartTax = () => {
        return getCartTotal() * 0.08; // 8% tax
    };

    const getDeliveryFee = () => {
        return getCartTotal() > 50 ? 0 : 4.99; // Free delivery over $50
    };

    const getCartGrandTotal = () => {
        return getCartSubtotal() + getCartTax() + getDeliveryFee();
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartSubtotal,
        getCartTax,
        getDeliveryFee,
        getCartGrandTotal,
        isLoading,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
