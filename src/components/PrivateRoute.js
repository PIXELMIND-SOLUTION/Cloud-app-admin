import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const adminAuth = sessionStorage.getItem("adminAuth") === "true";
  const subAdminAuth = sessionStorage.getItem("subAdminAuth") === "true";

  if (adminAuth || subAdminAuth) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;