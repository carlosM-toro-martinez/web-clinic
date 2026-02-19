import { useQuery } from "@tanstack/react-query";
import { useMemo, useContext, useEffect } from "react";
import whatsappService from "../async/services/get/whatsappService";
import { MainContext } from "../context/MainContext";

export const useWhatsappChats = () => {
  const { newMessageNotification } = useContext(MainContext);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["whatsappChats"],
    queryFn: whatsappService,
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    console.log("Refetch disparado desde socket");
    refetch();
  }, [newMessageNotification, refetch]);

  const sortedChats = useMemo(() => {
    if (!data || !Array.isArray(data?.data)) return [];

    return [...data?.data]
      .map((chat) => {
        return {
          ...chat,
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
