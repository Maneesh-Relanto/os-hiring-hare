import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: Role[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (accessToken: string, refreshToken: string, user: User | null) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  hasRole: (roleName: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
      hasRole: (roleName: string) => {
        const user = get().user;
        if (!user) return false;
        return user.roles.some(role => role.name === roleName);
      },
      hasAnyRole: (roleNames: string[]) => {
        const user = get().user;
        if (!user) return false;
        return user.roles.some(role => roleNames.includes(role.name));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
