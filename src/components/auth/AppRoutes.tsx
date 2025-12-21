import { Routes, Route, Navigate, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sync from '@/pages/Sync';
import Projects from '@/pages/Projects';

const PUBLIC_ROUTES = ['/login'];
const PROTECTED_ROUTES = ['/', '/sync', '/projects'];

export function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  const isProtectedRoute = PROTECTED_ROUTES.includes(location.pathname);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/sync" element={<Sync />} />
      <Route path="/projects" element={<Projects />} />
    </Routes>
  );
}

