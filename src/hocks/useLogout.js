import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutFunction } from "../utils/logout";
import { MainContext } from "../context/MainContext";

export const useLogout = () => {
  const navigate = useNavigate();
  const { setToken, setUser, setAuth } = useContext(MainContext);
  const handleLogout = useCallback(
    (options = {}) => {
      const { redirect = true, showMessage = true } = options;

      const result = logoutFunction();
      setToken("");
      setUser(null);
      setAuth(false);
      navigate("/login");

      if (showMessage && result.success) {
        console.log("Sesión cerrada exitosamente");
      }

      return result;
    },
    [navigate]
  );

  const forceLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  return {
    logout: handleLogout,
    forceLogout,
    isLoggedIn: () => !!localStorage.getItem("token"),
    getCurrentUser: () => {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    },
  };
};
