// Mock user data for authentication
// In production, authentication would be handled via API endpoints like:
// POST /api/auth/login
// POST /api/auth/register
// GET /api/auth/user

export const users = [
    {
        id: 1,
        email: "demo@example.com",
        password: "password123", // In production, passwords would be hashed
        name: "John Doe",
        phone: "+1 (555) 123-4567",
        addresses: [
            {
                id: 1,
                type: "home",
                street: "123 Main Street",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                isDefault: true
            },
            {
                id: 2,
                type: "work",
                street: "456 Business Ave",
                city: "New York",
                state: "NY",
                zipCode: "10002",
                isDefault: false
            }
        ],
        createdAt: "2024-01-15"
    },
    {
        id: 2,
        email: "admin@example.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        phone: "+1 (555) 987-6543",
        isAdmin: true,
        addresses: [
            {
                id: 1,
                type: "home",
                street: "789 Admin Road",
                city: "Los Angeles",
                state: "CA",
                zipCode: "90001",
                isDefault: true
            }
        ],
        createdAt: "2023-12-01"
    }
];

// Mock authentication function
// In production, this would be replaced with: POST /api/auth/login
export const authenticateUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Return user without password
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        return userWithoutPassword;
    }
    return null;
};

// Mock registration function
// In production, this would be replaced with: POST /api/auth/register
export const registerUser = (userData) => {
    const newUser = {
        id: users.length + 1,
        ...userData,
        addresses: [],
        createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    return userWithoutPassword;
};
