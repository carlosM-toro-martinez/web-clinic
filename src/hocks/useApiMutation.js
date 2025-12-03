import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { MainContext } from "../context/MainContext";

export default function useApiMutation(apiFunction, options = {}) {
  const { token } = useContext(MainContext);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [data, setData] = useState();
  const [idEdit, setIdEdit] = useState(null);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      console.log(idEdit);

      const response = await apiFunction(
        payload,
        token,
        idEdit ? idEdit : null
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
    onError: (error, variables, context) => {
      setType("error");
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Ocurrió un error inesperado "
      );

      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    message,
    type,
    reset: () => setMessage(""),
    data,
    setIdEdit,
  };
}
