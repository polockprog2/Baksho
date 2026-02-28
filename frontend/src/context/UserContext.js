"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
    updateUserProfileApi,
    addAddressApi,
    updateAddressApi,
    deleteAddressApi
} from '@/api/user.api';

// Create User Context
const UserContext = createContext();

// Custom hook to use user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};

// User Provider Component
export const UserProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const isLoading = status === 'loading';

    // Synchronize local user state with NextAuth session
    useEffect(() => {
        if (session?.user) {
            setUser(session.user);
        } else if (status === 'unauthenticated') {
            setUser(null);
        }
    }, [session, status]);

    // Login function using NextAuth
    const login = async (email, password) => {
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                return { success: false, error: result.error };
            }
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    // Register function via custom API, then sign in with NextAuth
    const register = async (userData) => {
        try {
            // Import registerUserApi dynamically or keep it in context if needed
            // For now, we'll keep it simple: register via API, then signIn
            const registerUserApi = (await import('@/api/user.api')).registerUserApi;
            const response = await registerUserApi(userData);

            if (response.success || response.user) {
                // Automatically log in after registration
                return await login(userData.email, userData.password);
            }
            return { success: false, error: 'Registration succeeded but login failed.' };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message || 'Registration failed.' };
        }
    };

    // Logout function using NextAuth
    const logout = () => {
        signOut({ redirect: false });
        setUser(null);
    };

    // Update user profile
    const updateProfile = async (updatedData) => {
        if (!user?.id) return { success: false, error: 'User not logged in' };
        try {
            const updatedUser = await updateUserProfileApi(user.id, updatedData);
            setUser(prevUser => ({
                ...prevUser,
                ...updatedUser
            }));
            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: error.message || 'Update failed' };
        }
    };

    // Add address
    const addAddress = async (address) => {
        if (!user?.id) return { success: false, error: 'User not logged in' };
        try {
            const newAddress = await addAddressApi(user.id, address);
            setUser(prevUser => ({
                ...prevUser,
                addresses: [...(prevUser.addresses || []), newAddress]
            }));
            return { success: true, address: newAddress };
        } catch (error) {
            console.error('Add address error:', error);
            return { success: false, error: error.message || 'Failed to add address' };
        }
    };

    // Update address
    const updateAddress = async (addressId, updatedAddress) => {
        if (!user?.id) return { success: false, error: 'User not logged in' };
        try {
            const result = await updateAddressApi(user.id, addressId, updatedAddress);
            setUser(prevUser => ({
                ...prevUser,
                addresses: prevUser.addresses.map(addr =>
                    addr.id === addressId ? { ...addr, ...result } : addr
                )
            }));
            return { success: true, address: result };
        } catch (error) {
            console.error('Update address error:', error);
            return { success: false, error: error.message || 'Failed to update address' };
        }
    };

    // Delete address
    const deleteAddress = async (addressId) => {
        if (!user?.id) return { success: false, error: 'User not logged in' };
        try {
            await deleteAddressApi(user.id, addressId);
            setUser(prevUser => ({
                ...prevUser,
                addresses: prevUser.addresses.filter(addr => addr.id !== addressId)
            }));
            return { success: true };
        } catch (error) {
            console.error('Delete address error:', error);
            return { success: false, error: error.message || 'Failed to delete address' };
        }
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return user !== null;
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'ADMIN' || user?.isAdmin === true;
    };

    const value = {
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        isAuthenticated,
        isAdmin
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
