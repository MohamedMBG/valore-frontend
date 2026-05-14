export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Quote helpers
 */
export const getAllQuotes = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/quotes`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    }
};

export const createQuote = async (quoteData, token) => {
    const res = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quoteData)
    });
    if (!res.ok) throw new Error("Failed to create quote");
    return await res.json();
};

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

/**
 * Dashboard helpers
 */
export const getMyOrders = async (token) => {
    const res = await fetch(`${API_BASE_URL}/users/me/orders`, {
        headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
};

export const getMyProfile = async (token) => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
};

export const updateMyProfile = async (token, profileData) => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
};

/**
 * Admin helpers
 */
export const getAdminStats = async (token) => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return await res.json();
};

export const getAdminOrders = async (token) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to fetch admin orders");
    return await res.json();
};

export const getAdminProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
};

export const createAdminProduct = async (token, productData) => {
    const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error("Failed to create product");
    return await res.json();
};

export const updateAdminProduct = async (token, productId, productData) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error("Failed to update product");
    return await res.json();
};

export const deleteAdminProduct = async (token, productId) => {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to delete product");
};
