import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, use } from "react";
import cashRegisterService from "../async/services/get/cashRegisterService";

function useMain() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const {
    data: cajaResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cashRegister"],
    queryFn: cashRegisterService,
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setAuth(true);
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    setAuth(false);
    localStorage.removeItem("user");
  };

  return {
    auth,
    user,
    token,
    cajaResponse,
    setToken,
    setUser,
    setAuth,
    logout,
  };
}

export default useMain;
