import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfo {
  id: string;
  username: string;
  roles: any[];
  permissions: string[];
  isAdmin: boolean;
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  setAuth: (token: string, userInfo: UserInfo) => void;
  clearAuth: () => void;
  hasPermission: (code: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userInfo: null,
      setAuth: (token, userInfo) => {
        const permissions = userInfo.roles?.flatMap(r => r.permissions?.map((p: any) => p.code) || []) || [];
        const isAdmin = userInfo.roles?.some(r => r.name === '超级管理员') || false;
        set({ token, userInfo: { ...userInfo, permissions, isAdmin } });
      },
      clearAuth: () => set({ token: null, userInfo: null }),
      hasPermission: (code: string) => {
        const { userInfo } = get();
        if (!userInfo) return false;
        if (userInfo.isAdmin) return true;
        return userInfo.permissions.includes(code);
      }
    }),
    { name: 'auth-storage' }
  )
);
