'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import { setAuth, isAuthenticated } from '../../utils/auth';
import { LoginCredentials } from '../../types';

export default function SignIn() {
    const [formData, setFormData] = useState<LoginCredentials>({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Untuk field username dan password: remove spaces dan convert ke lowercase
        if (e.target.name === 'username' || e.target.name === 'password') {
            value = value.replace(/\s/g, '').toLowerCase();
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.username.trim()) {
            setError('Username tidak boleh kosong');
            setLoading(false);
            return;
        }

        if (!formData.password.trim()) {
            setError('Password tidak boleh kosong');
            setLoading(false);
            return;
        }

        try {
            const user = await api.login(formData);

            if (user) {
                setAuth(user);
                router.push('/dashboard');
            } else {
                setError('Username atau password salah');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Pastikan JSON Server berjalan di port 3001');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Sign in
                    </h1>
                    <p className="text-gray-600">
                        Welcome back! Please sign in to your account
                    </p>
                </div>

                {/* Demo Credentials */}
                <div className="card mb-6">
                    <div className="card-body">
                        <h3 className="font-medium text-gray-900 mb-3">Demo Account</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">User</span>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                    user1 / password123
                                </code>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Admin</span>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                    admin1 / adminpassword
                                </code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form */}
                <div className="card">
                    <div className="card-body">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="username" className="form-label">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner mr-2"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        Dashboard App © 2024
                    </p>
                </div>
            </div>
        </div>
    );
}