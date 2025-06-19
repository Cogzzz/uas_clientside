import { User, Product, LoginCredentials, ProductFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
    // Auth
    login: async (credentials: LoginCredentials): Promise<User | null> => {
        const response = await fetch(
            `${API_BASE_URL}/users?username=${credentials.username}&password=${credentials.password}`
        );
        const users: User[] = await response.json();
        return users.length > 0 ? users[0] : null;
    },

    // Products
    getProducts: async (): Promise<Product[]> => {
        const response = await fetch(`${API_BASE_URL}/products`);
        return await response.json();
    },

    createProduct: async (product: ProductFormData): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        return await response.json();
    },

    updateProduct: async (id: number, product: ProductFormData): Promise<Product> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        return await response.json();
    },

    deleteProduct: async (id: number): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    },
};