'use client';

import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '../types';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: ProductFormData) => void;
    product?: Product | null;
    title?: string;
}

export default function ProductModal({
    isOpen,
    onClose,
    onSave,
    product = null,
    title = "Add Product"
}: ProductModalProps) {
    const [formData, setFormData] = useState<{
        nama_produk: string;
        harga_satuan: string;
        quantity: string;
    }>({
        nama_produk: '',
        harga_satuan: '',
        quantity: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                nama_produk: product.nama_produk,
                harga_satuan: product.harga_satuan.toString(),
                quantity: product.quantity.toString()
            });
        } else {
            setFormData({
                nama_produk: '',
                harga_satuan: '',
                quantity: ''
            });
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData: ProductFormData = {
            nama_produk: formData.nama_produk,
            harga_satuan: parseInt(formData.harga_satuan),
            quantity: parseInt(formData.quantity)
        };
        onSave(productData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body space-y-4">
                        <div className="form-group">
                            <label className="form-label">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="nama_produk"
                                value={formData.nama_produk}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Price (IDR)
                            </label>
                            <input
                                type="number"
                                name="harga_satuan"
                                value={formData.harga_satuan}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                        >
                            {product ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}