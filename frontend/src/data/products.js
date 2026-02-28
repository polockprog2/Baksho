// Mock product data for grocery e-commerce
// In production, this data would come from an API endpoint like: GET /api/products

export const products = [
    // Vegetables
    {
        id: 1,
        name: "Fresh Tomatoes",
        category: "vegetables",
        price: 2.99,
        originalPrice: 3.99,
        discount: 25,
        rating: 4.5,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400",
        description: "Fresh, ripe tomatoes perfect for salads and cooking. Locally sourced and organic.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 2,
        name: "Red Onions",
        category: "vegetables",
        price: 1.49,
        originalPrice: 1.99,
        discount: 25,
        rating: 4.3,
        reviews: 95,
        image: null,
        description: "Crisp red onions with a mild, sweet flavor. Great for grilling and salads.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 3,
        name: "Russet Potatoes",
        category: "vegetables",
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        rating: 4.6,
        reviews: 203,
        image: null,
        description: "Premium russet potatoes ideal for baking, mashing, and frying.",
        inStock: true,
        unit: "5 lb bag"
    },
    {
        id: 4,
        name: "Fresh Carrots",
        category: "vegetables",
        price: 2.49,
        originalPrice: 2.49,
        discount: 0,
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400",
        description: "Sweet, crunchy carrots packed with vitamins. Perfect for snacking and cooking.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 5,
        name: "Broccoli Crowns",
        category: "vegetables",
        price: 3.49,
        originalPrice: 3.49,
        discount: 0,
        rating: 4.4,
        reviews: 87,
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=400",
        description: "Fresh broccoli crowns, rich in nutrients and perfect for steaming or roasting.",
        inStock: true,
        unit: "each"
    },
    {
        id: 6,
        name: "Bell Peppers Mix",
        category: "vegetables",
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        rating: 4.5,
        reviews: 112,
        image: null,
        description: "Colorful mix of red, yellow, and green bell peppers. Sweet and crunchy.",
        inStock: true,
        unit: "3 pack"
    },
    {
        id: 7,
        name: "Fresh Spinach",
        category: "vegetables",
        price: 2.99,
        originalPrice: 2.99,
        discount: 0,
        rating: 4.6,
        reviews: 145,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400",
        description: "Tender baby spinach leaves, pre-washed and ready to use.",
        inStock: true,
        unit: "10 oz bag"
    },
    {
        id: 8,
        name: "Cucumber",
        category: "vegetables",
        price: 1.29,
        originalPrice: 1.29,
        discount: 0,
        rating: 4.3,
        reviews: 76,
        image: "https://images.unsplash.com/photo-1449333254714-23eeffcf6c23?auto=format&fit=crop&q=80&w=400",
        description: "Crisp, refreshing cucumbers perfect for salads and snacking.",
        inStock: true,
        unit: "each"
    },

    // Fruits
    {
        id: 9,
        name: "Gala Apples",
        category: "fruits",
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        rating: 4.7,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400",
        description: "Sweet and crispy Gala apples. Perfect for snacking and baking.",
        inStock: true,
        unit: "3 lb bag"
    },
    {
        id: 10,
        name: "Bananas",
        category: "fruits",
        price: 0.59,
        originalPrice: 0.59,
        discount: 0,
        rating: 4.8,
        reviews: 456,
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=400",
        description: "Fresh, ripe bananas rich in potassium. Great for smoothies and snacking.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 11,
        name: "Navel Oranges",
        category: "fruits",
        price: 4.49,
        originalPrice: 5.49,
        discount: 18,
        rating: 4.6,
        reviews: 189,
        image: null,
        description: "Juicy navel oranges bursting with vitamin C. Seedless and easy to peel.",
        inStock: true,
        unit: "4 lb bag"
    },
    {
        id: 12,
        name: "Strawberries",
        category: "fruits",
        price: 3.99,
        originalPrice: 4.99,
        discount: 20,
        rating: 4.5,
        reviews: 267,
        image: null,
        description: "Sweet, fresh strawberries. Perfect for desserts and breakfast.",
        inStock: true,
        unit: "16 oz container"
    },
    {
        id: 13,
        name: "Blueberries",
        category: "fruits",
        price: 4.99,
        originalPrice: 6.49,
        discount: 23,
        rating: 4.7,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=400",
        description: "Plump, fresh blueberries packed with antioxidants.",
        inStock: true,
        unit: "12 oz container"
    },
    {
        id: 14,
        name: "Grapes",
        category: "fruits",
        price: 2.99,
        originalPrice: 2.99,
        discount: 0,
        rating: 4.4,
        reviews: 143,
        image: "https://images.unsplash.com/photo-1537640538966-79f369b40189?auto=format&fit=crop&q=80&w=400",
        description: "Seedless green grapes, sweet and refreshing.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 15,
        name: "Watermelon",
        category: "fruits",
        price: 5.99,
        originalPrice: 7.99,
        discount: 25,
        rating: 4.6,
        reviews: 176,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
        description: "Sweet, juicy watermelon perfect for summer refreshment.",
        inStock: true,
        unit: "each"
    },
    {
        id: 16,
        name: "Mangoes",
        category: "fruits",
        price: 1.99,
        originalPrice: 2.49,
        discount: 20,
        rating: 4.5,
        reviews: 134,
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400",
        description: "Ripe, tropical mangoes with sweet, juicy flesh.",
        inStock: true,
        unit: "each"
    },

    // Meat & Fish
    {
        id: 17,
        name: "Chicken Breast",
        category: "meat-fish",
        price: 7.99,
        originalPrice: 9.99,
        discount: 20,
        rating: 4.6,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=400",
        description: "Fresh, boneless chicken breast. Lean protein for healthy meals.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 18,
        name: "Ground Beef",
        category: "meat-fish",
        price: 5.99,
        originalPrice: 6.99,
        discount: 14,
        rating: 4.5,
        reviews: 245,
        image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=400",
        description: "Premium ground beef, 85% lean. Perfect for burgers and tacos.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 19,
        name: "Atlantic Salmon",
        category: "meat-fish",
        price: 12.99,
        originalPrice: 14.99,
        discount: 13,
        rating: 4.7,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400",
        description: "Fresh Atlantic salmon fillet, rich in omega-3 fatty acids.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 20,
        name: "Pork Chops",
        category: "meat-fish",
        price: 6.99,
        originalPrice: 8.49,
        discount: 18,
        rating: 4.4,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1602491673980-73aa38de027a?auto=format&fit=crop&q=80&w=400",
        description: "Tender, bone-in pork chops perfect for grilling.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 21,
        name: "Shrimp",
        category: "meat-fish",
        price: 9.99,
        originalPrice: 11.99,
        discount: 17,
        rating: 4.6,
        reviews: 201,
        image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&q=80&w=400",
        description: "Large, peeled and deveined shrimp. Ready to cook.",
        inStock: true,
        unit: "per lb"
    },
    {
        id: 22,
        name: "Turkey Breast",
        category: "meat-fish",
        price: 8.49,
        originalPrice: 8.49,
        discount: 0,
        rating: 4.5,
        reviews: 134,
        image: "https://images.unsplash.com/photo-1518492104633-ac38d094a9d4?auto=format&fit=crop&q=80&w=400",
        description: "Lean turkey breast, perfect for healthy sandwiches and meals.",
        inStock: true,
        unit: "per lb"
    },

    // Dairy
    {
        id: 23,
        name: "Whole Milk",
        category: "dairy",
        price: 3.49,
        originalPrice: 3.99,
        discount: 13,
        rating: 4.6,
        reviews: 423,
        image: "https://images.unsplash.com/photo-1563636619-e910009355dc?auto=format&fit=crop&q=80&w=400",
        description: "Fresh whole milk from local farms. Rich and creamy.",
        inStock: true,
        unit: "1 gallon"
    },
    {
        id: 24,
        name: "Cheddar Cheese",
        category: "dairy",
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        rating: 4.7,
        reviews: 289,
        image: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=400",
        description: "Sharp cheddar cheese, aged to perfection. Great for snacking and cooking.",
        inStock: true,
        unit: "8 oz block"
    },
    {
        id: 25,
        name: "Greek Yogurt",
        category: "dairy",
        price: 5.49,
        originalPrice: 6.49,
        discount: 15,
        rating: 4.8,
        reviews: 356,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
        description: "Thick, creamy Greek yogurt. High in protein and probiotics.",
        inStock: true,
        unit: "32 oz container"
    },
    {
        id: 26,
        name: "Butter",
        category: "dairy",
        price: 3.99,
        originalPrice: 4.49,
        discount: 11,
        rating: 4.5,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=400",
        description: "Salted butter made from fresh cream. Perfect for baking and cooking.",
        inStock: true,
        unit: "1 lb"
    },
    {
        id: 27,
        name: "Eggs",
        category: "dairy",
        price: 2.99,
        originalPrice: 3.49,
        discount: 14,
        rating: 4.7,
        reviews: 512,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400",
        description: "Farm-fresh large eggs. Grade A quality.",
        inStock: true,
        unit: "dozen"
    },
    {
        id: 28,
        name: "Mozzarella Cheese",
        category: "dairy",
        price: 4.49,
        originalPrice: 4.49,
        discount: 0,
        rating: 4.6,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1558210857-3932fa51c89f?auto=format&fit=crop&q=80&w=400",
        description: "Fresh mozzarella cheese, perfect for pizza and caprese salad.",
        inStock: true,
        unit: "8 oz"
    },
    {
        id: 29,
        name: "Sour Cream",
        category: "dairy",
        price: 2.49,
        originalPrice: 2.99,
        discount: 17,
        rating: 4.4,
        reviews: 167,
        image: "https://images.unsplash.com/photo-1528750955925-50f6da8ed88f?auto=format&fit=crop&q=80&w=400",
        description: "Rich, tangy sour cream. Great for dips and toppings.",
        inStock: true,
        unit: "16 oz"
    },

    // Packaged Food
    {
        id: 30,
        name: "Basmati Rice",
        category: "packaged-food",
        price: 8.99,
        originalPrice: 10.99,
        discount: 18,
        rating: 4.7,
        reviews: 289,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
        description: "Premium basmati rice with long, aromatic grains.",
        inStock: true,
        unit: "5 lb bag"
    },
    {
        id: 31,
        name: "Pasta",
        category: "packaged-food",
        price: 1.99,
        originalPrice: 2.49,
        discount: 20,
        rating: 4.5,
        reviews: 345,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400",
        description: "Italian penne pasta made from durum wheat.",
        inStock: true,
        unit: "16 oz box"
    },
    {
        id: 32,
        name: "Whole Grain Bread",
        category: "packaged-food",
        price: 3.49,
        originalPrice: 3.99,
        discount: 13,
        rating: 4.6,
        reviews: 267,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
        description: "Freshly baked whole grain bread, soft and nutritious.",
        inStock: true,
        unit: "24 oz loaf"
    },
    {
        id: 33,
        name: "Breakfast Cereal",
        category: "packaged-food",
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        rating: 4.4,
        reviews: 412,
        image: "https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&q=80&w=400",
        description: "Crunchy whole grain cereal with honey. Heart-healthy breakfast.",
        inStock: true,
        unit: "18 oz box"
    },
    {
        id: 34,
        name: "Peanut Butter",
        category: "packaged-food",
        price: 5.49,
        originalPrice: 6.49,
        discount: 15,
        rating: 4.7,
        reviews: 389,
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400",
        description: "Creamy peanut butter made from roasted peanuts. No added sugar.",
        inStock: true,
        unit: "16 oz jar"
    },
    {
        id: 35,
        name: "Olive Oil",
        category: "packaged-food",
        price: 9.99,
        originalPrice: 12.99,
        discount: 23,
        rating: 4.8,
        reviews: 456,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400",
        description: "Extra virgin olive oil, cold-pressed from premium olives.",
        inStock: true,
        unit: "25 oz bottle"
    },
    {
        id: 36,
        name: "Canned Tomatoes",
        category: "packaged-food",
        price: 1.49,
        originalPrice: 1.99,
        discount: 25,
        rating: 4.5,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1590004953392-5abc2e7df4ee?auto=format&fit=crop&q=80&w=400",
        description: "Diced tomatoes in rich tomato juice. Perfect for sauces and soups.",
        inStock: true,
        unit: "14.5 oz can"
    },
    {
        id: 37,
        name: "Black Beans",
        category: "packaged-food",
        price: 1.29,
        originalPrice: 1.29,
        discount: 0,
        rating: 4.4,
        reviews: 178,
        image: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?auto=format&fit=crop&q=80&w=400",
        description: "Canned black beans, ready to use. High in protein and fiber.",
        inStock: true,
        unit: "15 oz can"
    },
    {
        id: 38,
        name: "Honey",
        category: "packaged-food",
        price: 6.99,
        originalPrice: 8.49,
        discount: 18,
        rating: 4.6,
        reviews: 201,
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80&w=400",
        description: "Pure, raw honey from local beekeepers. Natural sweetener.",
        inStock: true,
        unit: "16 oz jar"
    },

    // Household Essentials
    {
        id: 39,
        name: "Paper Towels",
        category: "household",
        price: 12.99,
        originalPrice: 14.99,
        discount: 13,
        rating: 4.5,
        reviews: 567,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400",
        description: "Ultra-absorbent paper towels. 8 mega rolls.",
        inStock: true,
        unit: "8 pack"
    },
    {
        id: 40,
        name: "Dish Soap",
        category: "household",
        price: 3.49,
        originalPrice: 3.99,
        discount: 13,
        rating: 4.6,
        reviews: 423,
        image: "https://images.unsplash.com/photo-1605663415121-7243c2d8479e?auto=format&fit=crop&q=80&w=400",
        description: "Powerful dish soap that cuts through grease. Fresh scent.",
        inStock: true,
        unit: "24 oz bottle"
    },
    {
        id: 41,
        name: "Laundry Detergent",
        category: "household",
        price: 11.99,
        originalPrice: 13.99,
        discount: 14,
        rating: 4.7,
        reviews: 689,
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80e0bce?auto=format&fit=crop&q=80&w=400",
        description: "High-efficiency laundry detergent. Fresh clean scent. 64 loads.",
        inStock: true,
        unit: "100 oz bottle"
    },
    {
        id: 42,
        name: "Toilet Paper",
        category: "household",
        price: 18.99,
        originalPrice: 21.99,
        discount: 14,
        rating: 4.6,
        reviews: 812,
        image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=400",
        description: "Soft, strong toilet paper. 12 mega rolls = 48 regular rolls.",
        inStock: true,
        unit: "12 pack"
    },
    {
        id: 43,
        name: "All-Purpose Cleaner",
        category: "household",
        price: 4.49,
        originalPrice: 5.49,
        discount: 18,
        rating: 4.5,
        reviews: 345,
        image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400",
        description: "Multi-surface cleaner that disinfects and deodorizes.",
        inStock: true,
        unit: "32 oz spray bottle"
    },
    {
        id: 44,
        name: "Trash Bags",
        category: "household",
        price: 9.99,
        originalPrice: 11.99,
        discount: 17,
        rating: 4.4,
        reviews: 456,
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=400",
        description: "Heavy-duty trash bags with drawstring. 13 gallon, 80 count.",
        inStock: true,
        unit: "80 count"
    },
    {
        id: 45,
        name: "Sponges",
        category: "household",
        price: 5.99,
        originalPrice: 6.99,
        discount: 14,
        rating: 4.3,
        reviews: 289,
        image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=400",
        description: "Non-scratch scrub sponges for dishes and surfaces.",
        inStock: true,
        unit: "6 pack"
    },
    {
        id: 46,
        name: "Hand Soap",
        category: "household",
        price: 2.99,
        originalPrice: 3.49,
        discount: 14,
        rating: 4.5,
        reviews: 378,
        image: "https://images.unsplash.com/photo-1603507864264-d9ae3f4196ff?auto=format&fit=crop&q=80&w=400",
        description: "Moisturizing hand soap with antibacterial protection.",
        inStock: true,
        unit: "12 oz pump bottle"
    },
    {
        id: 47,
        name: "Aluminum Foil",
        category: "household",
        price: 4.99,
        originalPrice: 5.99,
        discount: 17,
        rating: 4.4,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1596751303335-74f350c6d99b?auto=format&fit=crop&q=80&w=400",
        description: "Heavy-duty aluminum foil for cooking and food storage.",
        inStock: true,
        unit: "75 sq ft roll"
    },
    {
        id: 48,
        name: "Plastic Wrap",
        category: "household",
        price: 3.99,
        originalPrice: 4.49,
        discount: 11,
        rating: 4.3,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1610486544929-e58f000418c3?auto=format&fit=crop&q=80&w=400",
        description: "Clear plastic wrap for food storage and preservation.",
        inStock: true,
        unit: "100 sq ft roll"
    },
    {
        id: 49,
        name: "Ziplock Bags",
        category: "household",
        price: 6.49,
        originalPrice: 7.49,
        discount: 13,
        rating: 4.6,
        reviews: 512,
        image: "https://images.unsplash.com/photo-1620138546344-7b2c3851bded?auto=format&fit=crop&q=80&w=400",
        description: "Resealable storage bags in assorted sizes. Freezer safe.",
        inStock: true,
        unit: "variety pack"
    },
    {
        id: 50,
        name: "Bleach",
        category: "household",
        price: 3.49,
        originalPrice: 3.99,
        discount: 13,
        rating: 4.5,
        reviews: 289,
        image: "https://images.unsplash.com/photo-1584622113334-93be9539f15a?auto=format&fit=crop&q=80&w=400",
        description: "Concentrated bleach for whitening and disinfecting.",
        inStock: true,
        unit: "64 oz bottle"
    }
];

// Helper function to get products by category
// In production, this would be replaced with: GET /api/products?category={category}
export const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
};

// Helper function to get product by ID
// In production, this would be replaced with: GET /api/products/{id}
export const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
};

// Helper function to search products
// In production, this would be replaced with: GET /api/products/search?q={query}
export const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
};

// Helper function to get featured products
// In production, this would be replaced with: GET /api/products/featured
export const getFeaturedProducts = () => {
    return products.filter(product => product.rating >= 4.6).slice(0, 8);
};

// Helper function to get products on sale
// In production, this would be replaced with: GET /api/products/deals
export const getDealsProducts = () => {
    return products.filter(product => product.discount > 0).slice(0, 8);
};
