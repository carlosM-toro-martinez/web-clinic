export const logout = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");

    sessionStorage.clear();

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("logout"));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "logout",
          newValue: Date.now().toString(),
        })
      );
    }

    console.log("Sesión cerrada exitosamente");
    return { success: true, message: "Sesión cerrada exitosamente" };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, message: "Error al cerrar sesión", error };
  }
};

export const logoutAndRedirect = (navigate) => {
  const result = logout();
  if (navigate && typeof navigate === "function") {
    navigate("/login");
  }
  return result;
};

export const isLoggedIn = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return false;

    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry) {
      return Date.now() < parseInt(tokenExpiry);
    }

    return true;
  } catch {
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearAppData = () => {
  const keysToKeep = ["token", "user", "auth"];
  const allKeys = Object.keys(localStorage);

  allKeys.forEach((key) => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  console.log("Datos de aplicación limpiados, sesión mantenida");
  return { success: true, message: "Datos de aplicación limpiados" };
};
