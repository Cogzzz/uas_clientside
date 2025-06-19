'use client';

import { useRouter } from 'next/navigation';
import { getAuth, removeAuth, isAdmin } from '../utils/auth';

export default function Navigation() {
    const router = useRouter();
    const user = getAuth();

    const handleLogout = () => {
        removeAuth();
        router.push('/signin');
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="flex items-center space-x-4">
                    <div className="navbar-brand">
                        Dashboard
                    </div>

                    {isAdmin() && (
                        <div className="badge badge-primary">
                            Admin
                        </div>
                    )}
                </div>

                <div className="navbar-actions">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 text-sm">
                                {user?.username}
                            </div>
                            <div className="text-xs text-gray-500">
                                {isAdmin() ? 'Administrator' : 'User'}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}