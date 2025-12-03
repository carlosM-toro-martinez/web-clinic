import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import cashRegisterService from "../async/services/get/cashRegisterService";

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
        setShouldFetchCaja(true);
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    if (cajaResponse) {
      setCashRegister(cajaResponse);
    }
  }, [cajaResponse]);

  const logout = () => {
    setUser(null);
    setAuth(false);
    setCashRegister(null);
    setShouldFetchCaja(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

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
