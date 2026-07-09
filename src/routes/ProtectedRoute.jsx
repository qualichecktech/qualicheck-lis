// src/routes/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingOverlay } from '../components/common/LoadingSpinner';

/**
 * Wrap any route element with this to require authentication, and
 * optionally a specific permission. Unauthenticated users are redirected
 * to /login. Authenticated users lacking the required permission are
 * redirected to /403.
 */
export default function ProtectedRoute({ children, permission }) {
  const { isAuthenticated, isActive, loading, can } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay label="Checking your session..." />;
  }

  if (!isAuthenticated || !isActive) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (permission && !can(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
