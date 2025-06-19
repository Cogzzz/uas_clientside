import Cookies from 'js-cookie';
import { User } from '../types';

export const setAuth = (user: User): void => {
    Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getAuth = (): User | null => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
};

export const removeAuth = (): void => {
    Cookies.remove('user');
};

export const isAuthenticated = (): boolean => {
    return !!getAuth();
};

export const isAdmin = (): boolean => {
    const user = getAuth();
    return user?.role === 'admin';
};