import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Spinner from './ui/Spinner.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking if user is logged in, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="indigo" />
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page
  return children;
};

export default ProtectedRoute;