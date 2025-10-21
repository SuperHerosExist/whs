import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to sign-in page, preserving the intended destination
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'coach') {
        return <Navigate to="/coach/dashboard" replace />;
      } else if (userRole === 'player') {
        return <Navigate to="/player/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};
