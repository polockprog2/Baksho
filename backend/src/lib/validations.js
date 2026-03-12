import { z } from 'zod';

export const variantSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Variant name is required'),
    price: z.number().positive('Price must be positive'),
    originalPrice: z.number().optional(),
    stock: z.number().int().min(0).default(0),
    sku: z.string().optional(),
});

// Product Validations
export const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    featured: z.boolean().default(false),
    categoryId: z.string().min(1, 'Category is required'),
    variants: z.array(variantSchema).min(1, 'At least one variant is required'),
    images: z.array(z.string()).optional(),
});

export const updateProductSchema = productSchema.partial();

// Auth Validations
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Category Validations
export const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    icon: z.string().optional(),
    image: z.string().optional(),
    description: z.string().optional(),
    parentId: z.string().optional(),
});

export const updateCategorySchema = categorySchema.partial();

// User Validations
export const updateUserSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
});

// Order Validations
export const orderItemSchema = z.object({
    variantId: z.string().min(1, 'Variant ID is required'),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
});

export const deliveryAddressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    country: z.string().optional(),
});

export const orderSchema = z.object({
    items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    deliveryFee: z.number().nonnegative(),
    total: z.number().positive(),
    paymentMethod: z.string(),
    deliveryAddressId: z.string().optional(),
    deliveryAddress: deliveryAddressSchema.optional(),
}).refine(
    (data) => data.deliveryAddressId || data.deliveryAddress,
    { message: 'Either deliveryAddressId or deliveryAddress is required' }
);
