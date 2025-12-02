import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../context/MainContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(MainContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
