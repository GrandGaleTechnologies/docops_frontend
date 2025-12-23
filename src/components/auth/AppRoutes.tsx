import { Routes, Route, Navigate, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Sync from '@/pages/Sync';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';

const PUBLIC_ROUTES = ['/login'];

// Check if route matches a protected route pattern
const isProtectedRoute = (pathname: string): boolean => {
  if (PUBLIC_ROUTES.includes(pathname)) return false;
  // All other routes are protected
  return true;
};

export function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  const isProtected = isProtectedRoute(location.pathname);

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
  if (!isAuthenticated && isProtected) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/sync" element={<Sync />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
    </Routes>
  );
}

