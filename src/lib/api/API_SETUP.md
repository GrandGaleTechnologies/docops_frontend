# API Integration Setup

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_API_URL=https://api-docops.up.railway.app
```

**Note:** The API URL defaults to `https://api-docops.up.railway.app` if not specified in the `.env` file.

## Setup Summary

### 1. Axios Configuration
- **Location:** `src/lib/api/axios.ts`
- **Features:**
  - Base URL configuration from environment variables
  - Request interceptor to attach authentication token to all requests
  - Response interceptor to handle 401 unauthorized responses (clears auth and redirects to login)

### 2. Auth API Endpoints
- **Location:** `src/lib/api/auth.ts`
- **Endpoints:**
  - `login(credentials)` - User login
  - `register(data)` - User registration
  - `logout()` - User logout
  - `getCurrentUser()` - Get current user profile
  - `refreshToken()` - Refresh authentication token

### 3. Auth Context
- **Location:** `src/contexts/AuthContext.tsx`
- **Features:**
  - Token management with automatic attachment to axios requests
  - localStorage persistence (survives page refresh)
  - Automatic token verification on app initialization
  - Login/logout functionality
  - User data management

### 4. Usage Example

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
      // User is now logged in and token is attached to all axios requests
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Authentication Flow

1. User logs in through the Login page
2. Token is stored in localStorage and attached to axios instance
3. All subsequent API requests automatically include the token
4. On 401 responses, auth is cleared and user is redirected to login
5. On page refresh, token is restored from localStorage and user remains logged in

