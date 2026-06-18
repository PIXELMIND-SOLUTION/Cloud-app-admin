import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("adminAuth");

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;