'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import { getAuth, isAuthenticated, isAdmin } from '../../utils/auth';
import Navigation from '../../components/Navigation';
import ProductModal from '../../components/ProductModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Product, ProductFormData } from '../../types';

export default function Dashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const router = useRouter();
    const user = getAuth();
    const userIsAdmin = isAdmin();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/signin');
            return;
        }

        fetchProducts();
    }, [router]);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            setError('Gagal memuat data produk. Pastikan JSON Server berjalan.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleSaveProduct = async (productData: ProductFormData) => {
        try {
            if (editingProduct) {
                await api.updateProduct(editingProduct.id, productData);
            } else {
                await api.createProduct(productData);
            }
            fetchProducts();
        } catch (err) {
            setError('Gagal menyimpan produk');
        }
    };

    const handleDeleteProduct = async (product: Product) => {
        setProductToDelete(product);
        setConfirmModalOpen(true);
    };

    const confirmDeleteProduct = async () => {
        if (productToDelete) {
            try {
                await api.deleteProduct(productToDelete.id);
                fetchProducts();
            } catch (err) {
                setError('Gagal menghapus produk');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="container py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="spinner mb-4"></div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <main className="container py-8">
                <div className="space-y-6 fade-in">
                    {/* Welcome Section */}
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Welcome, {user?.username}
                            </h1>
                            <p className="text-gray-600">
                                {userIsAdmin
                                    ? 'You have administrator access to manage products.'
                                    : 'You can view all available products here.'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                                        <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Stock</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {products.reduce((sum, product) => sum + product.quantity, 0)}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Access Level</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {userIsAdmin ? 'Admin' : 'User'}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {/* Products Section */}
                    <div className="card">
                        <div className="card-header">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                                    <p className="text-sm text-gray-600 mt-1">Manage your product inventory</p>
                                </div>
                                {userIsAdmin && (
                                    <button
                                        onClick={handleAddProduct}
                                        className="btn btn-primary"
                                    >
                                        Add Product
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="card-body">
                            {products.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-4">Get started by adding your first product.</p>
                                    {userIsAdmin && (
                                        <button
                                            onClick={handleAddProduct}
                                            className="btn btn-primary"
                                        >
                                            Add First Product
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                {userIsAdmin && <th>Actions</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                                                                <span className="text-white font-medium text-sm">
                                                                    {product.nama_produk.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{product.nama_produk}</div>
                                                                <div className="text-sm text-gray-500">ID: {product.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="font-medium text-gray-900">
                                                            {formatCurrency(product.harga_satuan)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`badge ${product.quantity > 10
                                                                ? 'badge-success'
                                                                : product.quantity > 5
                                                                    ? 'badge-warning'
                                                                    : 'badge-primary'
                                                            }`}>
                                                            {product.quantity} units
                                                        </div>
                                                    </td>
                                                    {userIsAdmin && (
                                                        <td>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEditProduct(product)}
                                                                    className="action-btn action-edit"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteProduct(product)}
                                                                    className="action-btn action-delete"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Modal */}
                    <ProductModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onSave={handleSaveProduct}
                        product={editingProduct}
                        title={editingProduct ? 'Edit Product' : 'Add New Product'}
                    />

                    {/* Confirmation Modal */}
                    <ConfirmationModal
                        isOpen={confirmModalOpen}
                        onClose={() => {
                            setConfirmModalOpen(false);
                            setProductToDelete(null);
                        }}
                        onConfirm={confirmDeleteProduct}
                        title="Delete Product"
                        message={
                            productToDelete
                                ? `Are you sure you want to delete "${productToDelete.nama_produk}"? This action cannot be undone.`
                                : "Are you sure you want to delete this product?"
                        }
                        confirmText="Delete"
                        cancelText="Cancel"
                        type="danger"
                    />
                </div>
            </main>
        </div>
    );
}