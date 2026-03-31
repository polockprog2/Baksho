"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { validateCoupon } from '@/api/coupon.api';

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
    const { user } = useUser();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Coupon state
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState(null);
    const [isCouponLoading, setIsCouponLoading] = useState(false);

    // Determine storage key based on user ID
    const cartKey = user?.id ? `cart_${user.id}` : 'cart_guest';
    const couponKey = user?.id ? `coupon_${user.id}` : 'coupon_guest';

    // Load cart from localStorage whenever the user (and thus the key) changes
    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const savedCart = localStorage.getItem(cartKey);

        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error(`Error loading cart from ${cartKey}:`, error);
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }

        // Also restore coupon
        const savedCoupon = localStorage.getItem(couponKey);
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch {
                setAppliedCoupon(null);
            }
        } else {
            setAppliedCoupon(null);
        }

        setIsLoading(false);
    }, [cartKey, couponKey]);

    // Save cart to localStorage whenever items or the user changes
    useEffect(() => {
        if (!isLoading && typeof window !== 'undefined') {
            try {
                localStorage.setItem(cartKey, JSON.stringify(cartItems));
            } catch (error) {
                console.error(`Failed to save cart to ${cartKey}:`, error);
                if (error.name === 'QuotaExceededError') {
                    alert('Your shopping cart is too full to save locally. Please checkout soon!');
                }
            }
        }
    }, [cartItems, cartKey, isLoading]);

    // Save coupon to localStorage
    useEffect(() => {
        if (!isLoading && typeof window !== 'undefined') {
            if (appliedCoupon) {
                localStorage.setItem(couponKey, JSON.stringify(appliedCoupon));
            } else {
                localStorage.removeItem(couponKey);
            }
        }
    }, [appliedCoupon, couponKey, isLoading]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.variantId === product.variantId);

            if (existingItem) {
                return prevItems.map(item =>
                    item.variantId === product.variantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
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
    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
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

    // Calculate coupon discount
    const getCouponDiscount = () => {
        if (!appliedCoupon) return 0;
        const subtotal = getCartSubtotal();

        if (appliedCoupon.type === 'PERCENTAGE') {
            const discount = subtotal * (appliedCoupon.value / 100);
            return appliedCoupon.maxDiscount
                ? Math.min(discount, appliedCoupon.maxDiscount)
                : discount;
        } else if (appliedCoupon.type === 'FIXED') {
            return Math.min(appliedCoupon.value, subtotal);
        }

        return 0;
    };

    const getCartTax = () => {
        const taxable = getCartSubtotal() - getCouponDiscount();
        return Math.max(0, taxable) * 0.08;
    };

    const getDeliveryFee = () => {
        const afterDiscount = getCartSubtotal() - getCouponDiscount();
        return afterDiscount > 50 ? 0 : 4.99;
    };

    const getCartGrandTotal = () => {
        return Math.max(0, getCartSubtotal() - getCouponDiscount()) + getCartTax() + getDeliveryFee();
    };

    // Apply coupon code
    const applyCoupon = async (code) => {
        if (!code?.trim()) {
            setCouponError('Please enter a coupon code.');
            return false;
        }

        const subtotal = getCartSubtotal();
        setIsCouponLoading(true);
        setCouponError(null);

        try {
            const coupon = await validateCoupon(code.trim().toUpperCase());

            if (coupon.minOrder && subtotal < coupon.minOrder) {
                setCouponError(`This coupon requires a minimum order of $${coupon.minOrder.toFixed(2)}.`);
                return false;
            }

            setAppliedCoupon(coupon);
            return true;
        } catch (err) {
            setCouponError(err.message || 'Invalid coupon code.');
            return false;
        } finally {
            setIsCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError(null);
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
        getCouponDiscount,
        getCartTax,
        getDeliveryFee,
        getCartGrandTotal,
        isLoading,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        // Coupon
        appliedCoupon,
        couponError,
        isCouponLoading,
        applyCoupon,
        removeCoupon,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
