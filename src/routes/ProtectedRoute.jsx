import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/MainContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const localStorageUser = localStorage.getItem("user");
  const storedUser = localStorageUser ? JSON.parse(localStorageUser) : null;

  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = user || storedUser;

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
