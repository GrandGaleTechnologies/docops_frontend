import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLogin, useLogout, useCurrentUser } from '@/lib/api/auth';
import { LoginCredentials, AuthUser } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/api/utils';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
const AUTH_USER_KEY = 'auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  
  // Only fetch current user if we have a token
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser(!!token);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            clearAuth();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update user when currentUser query succeeds
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Clear auth state and localStorage
  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      const { access_token, refresh_token, user: userData } = response;

      // Store tokens and user in state
      setToken(access_token);
      setUser(userData);

      // Persist to localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, access_token);
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

      // Token will be automatically attached to axios requests via interceptor
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout API call failed:', getErrorMessage(error));
    } finally {
      clearAuth();
      // Redirect to login page
      window.location.href = '/login';
    }
  };

  // Update user data
  const updateUser = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading: isLoading || isLoadingUser,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
