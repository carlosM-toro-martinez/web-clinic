import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import cashRegisterService from "../async/services/get/cashRegisterService";
import loginValidateService from "../async/services/post/loginValidateService";

function useMain() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [cashRegister, setCashRegister] = useState(null);
  const [shouldFetchCaja, setShouldFetchCaja] = useState(false);

  const {
    data: cajaResponse,
    isLoading: isLoadingCaja,
    isError: isErrorCaja,
    error: errorCaja,
    refetch: refetchCaja,
  } = useQuery({
    queryKey: ["cashRegister"],
    queryFn: cashRegisterService,
    enabled: shouldFetchCaja,
  });

  const logout = useCallback(() => {
    setUser(null);
    setAuth(false);
    setCashRegister(null);
    setShouldFetchCaja(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    const validateToken = async (storedToken) => {
      try {
        const response = await loginValidateService({ token: storedToken });

        if (response.ok && response.valid) {
          setShouldFetchCaja(true);
          return true;
        } else {
          console.warn("Token inválido o expirado:", response);
          logout();
          return false;
        }
      } catch (error) {
        console.error("Error al validar token:", error);
        logout();
        return false;
      }
    };

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setAuth(true);

        validateToken(storedToken);
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [logout]);

  useEffect(() => {
    if (cajaResponse) {
      setCashRegister(cajaResponse);
    }
  }, [cajaResponse]);

  return {
    auth,
    user,
    token,
    cashRegister,
    isLoadingCaja,
    isErrorCaja,
    errorCaja,
    refetchCaja,
    setToken,
    setUser,
    setAuth,
    setCashRegister,
    logout,
  };
}

export default useMain;
