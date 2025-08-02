import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUserType } from '../utils/api';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const navigate = useNavigate();
  const userType = getUserType();

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { replace: true });
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
      // Redirect to appropriate dashboard if user doesn't have required role
      navigate(`/${userType}-dashboard`, { replace: true });
    }
  }, [navigate, allowedRoles, userType]);

  if (!isAuthenticated()) {
    return null; // or a loading spinner
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return null; // or an access denied message
  }

  return <Outlet />;
};

export default ProtectedRoute;
