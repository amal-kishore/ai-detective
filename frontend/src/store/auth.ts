import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import api from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.access_token);
        set({ user: data.user, token: data.access_token });
      },

      register: async (email, username, password) => {
        const { data } = await api.post('/auth/register', { email, username, password });
        localStorage.setItem('token', data.access_token);
        set({ user: data.user, token: data.access_token });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    { name: 'casezero-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
