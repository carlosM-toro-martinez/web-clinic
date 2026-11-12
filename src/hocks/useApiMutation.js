import { useMutation } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { MainContext } from "../context/MainContext";

export default function useApiMutation(apiFunction, options = {}) {
  const { token } = useContext(MainContext);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [data, setData] = useState();
  const [idEdit, setIdEdit] = useState(null);
  // Candado contra doble envío (doble clic / Enter repetido): evita registros o cobros duplicados
  const inFlight = useRef(false);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiFunction(
        payload,
        token,
        idEdit ? idEdit : null,
      );
      return response;
    },
    onSuccess: (data, variables, context) => {
      setData(data);
      setType("success");
      setMessage("Operación realizada con éxito ");

      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onSettled: () => {
      inFlight.current = false;
    },
    onError: (error, variables, context) => {
      setType("error");
      // api.js lanza el código HTTP (número) cuando la respuesta no es ok
      const byStatus = {
        400: "Los datos enviados no son válidos. Revisa el formulario.",
        401: "Tu sesión expiró o no tienes permisos. Vuelve a iniciar sesión.",
        403: "No tienes permisos para realizar esta acción.",
        404: "No se encontró el registro solicitado.",
        409: "Ya existe un registro con esos datos (por ejemplo, CI o correo duplicado).",
        422: "Los datos enviados no son válidos. Revisa el formulario.",
      };
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          (typeof error === "number" && error >= 500
            ? "Error del servidor. Intenta nuevamente en unos minutos."
            : byStatus[error]) ||
          "Ocurrió un error inesperado ",
      );

      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });

  return {
    mutate: (payload, mutateOptions) => {
      if (inFlight.current) return;
      inFlight.current = true;
      mutation.mutate(payload, mutateOptions);
    },
    isPending: mutation.isPending,
    message,
    type,
    reset: () => setMessage(""),
    data,
    setIdEdit,
  };
}
