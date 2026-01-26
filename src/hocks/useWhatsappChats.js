import { useQuery } from "@tanstack/react-query";
import { useMemo, useContext, useEffect } from "react";
import whatsappService from "../async/services/get/whatsappService";
import { MainContext } from "../context/MainContext";

export const useWhatsappChats = () => {
  const { newMessageNotification, triggerChatRefetch } =
    useContext(MainContext);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["whatsappChats"],
    queryFn: whatsappService,
    refetchInterval: 30000,
  });

  useEffect(() => {
    console.log("Refetch disparado desde socket");
    refetch();
  }, [newMessageNotification]);

  const sortedChats = useMemo(() => {
    if (!data || !Array.isArray(data?.data)) return [];

    return [...data?.data]
      .map((chat) => {
        const isNew =
          (newMessageNotification?.patientId === chat.patientId ||
            newMessageNotification?.patientId === chat.patientPhone) &&
          newMessageNotification?.timestamp > Date.now() - 5000;

        return {
          ...chat,
          isNew,
        };
      })
      .sort((a, b) => {
        const timeA = new Date(a.lastMessage?.timestamp || 0);
        const timeB = new Date(b.lastMessage?.timestamp || 0);
        return timeB - timeA; // Más recientes primero
      });
  }, [data, newMessageNotification]);

  return {
    chats: sortedChats,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useWhatsappChats;
