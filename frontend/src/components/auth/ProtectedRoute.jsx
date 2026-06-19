import { Navigate } from 'react-router-dom';
import { getStoredToken, isTokenExpired } from '../../utils/tokenUtils';

export default function ProtectedRoute({ children }) {
  const token = getStoredToken();

  // If there is no token or if the token is expired, redirect to the login page
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  // If the token is valid, render the protected component
  return children;
}
