import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import apiRoutes from '../utils/apiRoutes';
import { persist, createJSONStorage } from 'zustand/middleware';

type User = {
    id: string;
    name: string;
    email: string;
    accountType: string;
};

type AuthState = {
    user: User | null; // Allow `null` explicitly
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    signup: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    removeUser: () => void;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null, // Initial state matches the type `User | null`
            loading: false,

            login: async (credentials) => {
                set({ loading: true });
                try {
                    const response = await axiosInstance.post(apiRoutes.login, credentials);

                    console.log('Login response:', response.data);

                    set({ user: response.data.data });
                } catch (error: any) {
                    console.error(
                        'Login failed:',
                        error?.response?.data?.message || error.message || 'Unknown error'
                    );
                    throw error; // Rethrow the error
                } finally {
                    set({ loading: false });
                }
            },
            signup: async (credentials) => {
                set({ loading: true });
                try {
                    await axiosInstance.post(apiRoutes.signup, credentials);
                } catch (error: any) {
                    throw error; // Rethrow the error
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                await axiosInstance.get(apiRoutes.logout);
                set({ user: null }); // This matches `User | null`
                localStorage.removeItem('auth-storage'); // Optional: clear storage

            },
            removeUser: () => {
                set({ user: null }); // This matches `User | null`
                localStorage.removeItem('auth-storage'); // Optional: clear storage
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;
