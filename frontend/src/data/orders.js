// Mock order data
// In production, this data would come from API endpoints like:
// GET /api/orders (for user's orders)
// GET /api/admin/orders (for all orders)
// POST /api/orders (to create new order)

export const orders = [
    {
        id: "ORD-2024-001",
        userId: 1,
        date: "2024-01-20",
        status: "delivered",
        items: [
            {
                productId: 9,
                productName: "Gala Apples",
                quantity: 2,
                price: 3.99,
                image: "/images/products/apples.jpg"
            },
            {
                productId: 23,
                productName: "Whole Milk",
                quantity: 1,
                price: 3.49,
                image: "/images/products/milk.jpg"
            },
            {
                productId: 32,
                productName: "Whole Grain Bread",
                quantity: 1,
                price: 3.49,
                image: "/images/products/bread.jpg"
            }
        ],
        subtotal: 14.96,
        tax: 1.20,
        deliveryFee: 4.99,
        total: 21.15,
        deliveryAddress: {
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001"
        },
        paymentMethod: "Credit Card",
        estimatedDelivery: "2024-01-22"
    },
    {
        id: "ORD-2024-002",
        userId: 1,
        date: "2024-01-25",
        status: "in-transit",
        items: [
            {
                productId: 17,
                productName: "Chicken Breast",
                quantity: 2,
                price: 7.99,
                image: "/images/products/chicken-breast.jpg"
            },
            {
                productId: 1,
                productName: "Fresh Tomatoes",
                quantity: 1,
                price: 2.99,
                image: "/images/products/tomatoes.jpg"
            },
            {
                productId: 2,
                productName: "Red Onions",
                quantity: 1,
                price: 1.49,
                image: "/images/products/onions.jpg"
            }
        ],
        subtotal: 20.46,
        tax: 1.64,
        deliveryFee: 4.99,
        total: 27.09,
        deliveryAddress: {
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001"
        },
        paymentMethod: "Debit Card",
        estimatedDelivery: "2024-01-27"
    },
    {
        id: "ORD-2024-003",
        userId: 1,
        date: "2024-02-01",
        status: "processing",
        items: [
            {
                productId: 30,
                productName: "Basmati Rice",
                quantity: 1,
                price: 8.99,
                image: "/images/products/rice.jpg"
            },
            {
                productId: 35,
                productName: "Olive Oil",
                quantity: 1,
                price: 9.99,
                image: "/images/products/olive-oil.jpg"
            }
        ],
        subtotal: 18.98,
        tax: 1.52,
        deliveryFee: 4.99,
        total: 25.49,
        deliveryAddress: {
            street: "456 Business Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002"
        },
        paymentMethod: "Credit Card",
        estimatedDelivery: "2024-02-03"
    }
];

// Helper function to get orders by user ID
// In production, this would be replaced with: GET /api/orders?userId={userId}
export const getOrdersByUserId = (userId) => {
    return orders.filter(order => order.userId === userId);
};

// Helper function to get order by ID
// In production, this would be replaced with: GET /api/orders/{orderId}
export const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
};

// Helper function to create new order
// In production, this would be replaced with: POST /api/orders
export const createOrder = (orderData) => {
    const newOrder = {
        id: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: "processing",
        ...orderData
    };
    orders.push(newOrder);
    return newOrder;
};
