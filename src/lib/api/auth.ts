import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from './axios';
import { ApiResponse } from './types';
import { getErrorMessage } from './utils';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: {
    id: number;
    email: string;
    full_name: string;
    created_at: string;
    updated_at: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name?: string;
  [key: string]: unknown;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

// Raw API functions (used by React Query)
export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/users/login',
      credentials
    );

    if (response.data.status === 'error' || !response.data.data) {
      const errorMessage = response.data.error?.msg || 'Login failed';
      throw new Error(errorMessage);
    }

    const { user, tokens } = response.data.data;
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/users/register',
      data
    );

    if (response.data.status === 'error' || !response.data.data) {
      const errorMessage = response.data.error?.msg || 'Registration failed';
      throw new Error(errorMessage);
    }

    const { user, tokens } = response.data.data;
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<null>>('/users/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await apiClient.get<ApiResponse<{ user: AuthUser }>>('/users/me');
    
    if (response.data.status === 'error' || !response.data.data) {
      const errorMessage = response.data.error?.msg || 'Failed to get user';
      throw new Error(errorMessage);
    }

    return response.data.data.user;
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken: string): Promise<{ access_token: string; refresh_token: string }> => {
    const response = await apiClient.post<ApiResponse<{ tokens: { access_token: string; refresh_token: string } }>>(
      '/users/refresh',
      { refresh_token: refreshToken }
    );

    if (response.data.status === 'error' || !response.data.data) {
      const errorMessage = response.data.error?.msg || 'Token refresh failed';
      throw new Error(errorMessage);
    }

    return response.data.data.tokens;
  },
};

// React Query hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    onError: (error) => {
      console.error('Login failed:', getErrorMessage(error));
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
    onError: (error) => {
      console.error('Registration failed:', getErrorMessage(error));
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout failed:', getErrorMessage(error));
    },
  });
};

export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.getCurrentUser,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: authAPI.refreshToken,
    onError: (error) => {
      console.error('Token refresh failed:', getErrorMessage(error));
    },
  });
};
