export interface User {
    id: number;
    username: string;
    password: string;
    role: 'user' | 'admin';
}

export interface Product {
    id: number;
    nama_produk: string;
    harga_satuan: number;
    quantity: number;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface ProductFormData {
    nama_produk: string;
    harga_satuan: number;
    quantity: number;
}