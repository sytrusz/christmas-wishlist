import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export function AdminRoute({ children }) {
  const isAdmin = sessionStorage.getItem('isAdmin');
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}