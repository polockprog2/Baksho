// Utility helper functions

// Format price to currency (standardized to USD)
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};

// Format date
export const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString; // Return original if invalid
        }

        // Use toLocaleDateString as a more compatible alternative
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return dateString;
    }
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Sort products
export const sortProducts = (products, sortBy) => {
    const sorted = [...products];

    switch (sortBy) {
        case 'price-low-high':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high-low':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'name-a-z':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-z-a':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        default:
            return sorted;
    }
};

// Filter products by category
export const filterByCategory = (products, category) => {
    if (!category || category === 'all') {
        return products;
    }
    return products.filter(product => {
        const productCategory = typeof product.category === 'object' ? product.category.slug : product.category;
        return productCategory === category;
    });
};

// Search products
export const searchProductsUtil = (products, query) => {
    if (!query) return products;

    const lowerQuery = query.toLowerCase();
    return products.filter(product => {
        const categoryName = typeof product.category === 'object' ? product.category.name : product.category;
        return (
            product.name.toLowerCase().includes(lowerQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerQuery)) ||
            categoryName.toLowerCase().includes(lowerQuery)
        );
    });
};

// Generate star rating
export const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
        full: fullStars,
        half: hasHalfStar ? 1 : 0,
        empty: emptyStars
    };
};

// Truncate text
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

// Generate order status badge color
export const getOrderStatusColor = (status) => {
    switch (status) {
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'in-transit':
            return 'bg-yellow-100 text-yellow-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Debounce function for search
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Flatten product data for easier filtering/sorting
export const flattenProduct = (product) => {
    const mainVariant = product.variants?.[0] || {};
    const mainImage = product.images?.[0]?.imageUrl || product.image || '/placeholder-product.png';
    const price = mainVariant.price || 0;
    const originalPrice = mainVariant.originalPrice || 0;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
        ...product,
        price: price || product.price,
        originalPrice: originalPrice || product.originalPrice,
        discount: discount || product.discount,
        stock: mainVariant.stock !== undefined ? mainVariant.stock : (product.stock || 0),
        inStock: mainVariant.stock !== undefined ? mainVariant.stock > 0 : (product.inStock || false),
        image: mainImage,
        variantId: mainVariant.id || product.variantId || null,
        variantName: mainVariant.name || product.variantName || null,
        totalVariants: product.variants?.length || product.totalVariants || 0
    };
};

