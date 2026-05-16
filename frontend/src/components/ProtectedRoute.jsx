import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Still verifying token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // User is not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in, but we need to verify their role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized members back to the dashboard safely
    return <Navigate to="/dashboard" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
