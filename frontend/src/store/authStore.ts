import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getToken, 
  isAuthenticated as checkAuth, 
  decodeToken,
  setTokenCookie,
  removeTokenCookie,
  removeToken
} from '@/utils/token';
import { DecodedToken } from '@/types/utils';
import { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      decodedToken: null,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string) => {
        // Store token in both localStorage and cookie
        setTokenCookie(token);
        
        // Decode token and extract user data
        const decoded: DecodedToken | null = decodeToken(token);
        
        set({ 
          decodedToken: decoded ? decoded : null,
          isAuthenticated: true 
        });
      },

      clearUser: () => {
        removeToken();
        removeTokenCookie();
        set({ 
          user: null, 
          isAuthenticated: false,
          decodedToken: null 
        });
      },

      logout: () => {
        removeToken();
        removeTokenCookie();
        set({ 
          user: null, 
          isAuthenticated: false,
          decodedToken: null 
        });
      },

      checkAuthentication: () => {
        const hasToken = checkAuth();
        const token = getToken();
        
        if (!hasToken || !token) {
          set({ 
            user: null, 
            isAuthenticated: false,
            decodedToken: null 
          });
        } else {
          const decoded: DecodedToken | null = decodeToken(token);
          set({ 
            isAuthenticated: true,
            decodedToken: decoded ? decoded : null 
          });
        }
      },
    }),
    {
      name: 'genesys-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
