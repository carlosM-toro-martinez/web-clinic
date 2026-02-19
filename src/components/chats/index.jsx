import React, { useState, useEffect, useContext } from "react";
import { MessageCircle, RefreshCw, AlertCircle } from "lucide-react";
import { MainContext } from "../../context/MainContext";
import useWhatsappChats from "../../hocks/useWhatsappChats";
import ChatCard from "./ChatCard";
import ChatWindow from "./ChatWindow";

function ChatsListComponent() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadById, setUnreadById] = useState({});
  const {
    newMessageNotification,
    clearNewMessageNotification,
    clearAllMessageNotifications,
  } = useContext(MainContext);
  const { chats, isLoading, isError, error, refetch } = useWhatsappChats();

  const unreadTotal = chats.reduce((total, chat) => {
    const count = Number(chat.unreadCount || 0);
    const localUnread =
      unreadById[chat.patientId] || unreadById[chat.patientPhone] ? 1 : 0;
    return total + Math.max(count, localUnread);
  }, 0);

  useEffect(() => {
    if (!newMessageNotification?.patientId) return;
    setUnreadById((prev) => ({
      ...prev,
      [newMessageNotification.patientId]: true,
      ...(newMessageNotification.patientPhone
        ? { [newMessageNotification.patientPhone]: true }
        : {}),
    }));
  }, [newMessageNotification]);

  useEffect(() => {
    clearAllMessageNotifications();
  }, [clearAllMessageNotifications]);

  useEffect(() => {
    if (!selectedChat) return;
    setUnreadById((prev) => {
      if (!prev[selectedChat.patientId] && !prev[selectedChat.patientPhone]) {
        return prev;
      }
      const next = { ...prev };
      delete next[selectedChat.patientId];
      if (selectedChat.patientPhone) {
        delete next[selectedChat.patientPhone];
      }
      return next;
    });
    if (
      newMessageNotification?.patientId === selectedChat.patientId ||
      newMessageNotification?.patientId === selectedChat.patientPhone
    ) {
      clearNewMessageNotification(
        selectedChat.patientPhone || selectedChat.patientId,
      );
    }
  }, [selectedChat, newMessageNotification, clearNewMessageNotification]);

  useEffect(() => {
    if (!selectedChat?.patientId) return;
    const updated = chats.find(
      (chat) => chat.patientId === selectedChat.patientId,
    );
    if (updated && updated !== selectedChat) {
      setSelectedChat(updated);
    }
  }, [chats, selectedChat]);

  const handleRefresh = () => {
    refetch();
  };

  const handleMessageSent = () => {
    refetch();
  };

  const handleChatSelected = (chat) => {
    setSelectedChat(chat);
    setUnreadById((prev) => {
      if (!prev[chat.patientId] && !prev[chat.patientPhone]) return prev;
      const next = { ...prev };
      delete next[chat.patientId];
      if (chat.patientPhone) {
        delete next[chat.patientPhone];
      }
      return next;
    });
    if (
      newMessageNotification?.patientId === chat.patientId ||
      newMessageNotification?.patientId === chat.patientPhone
    ) {
      clearNewMessageNotification(chat.patientPhone || chat.patientId);
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="text-center p-8 bg-[var(--color-background-secondary)] rounded-lg max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Error al cargar chats
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            {error?.message ||
              "No pudimos cargar los chats. Por favor intenta de nuevo."}
          </p>
          <button
            onClick={handleRefresh}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={18} />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Sidebar de chats */}
      <div className="w-80 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-background-secondary)]">
        {/* Header */}
        <div className="border-b border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle
                size={24}
                className="text-[var(--color-primary)]"
              />
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Chats
              </h1>
              {unreadTotal > 0 && (
                <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-bold bg-[var(--color-primary)] text-white">
                  {unreadTotal}
                </span>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg cursor-pointer hover:bg-[var(--color-hover)] disabled:opacity-50 text-[var(--text-primary)]"
              title="Actualizar chats"
            >
              <RefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && chats.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin mb-4">
                  <MessageCircle
                    size={32}
                    className="text-[var(--color-primary)]"
                  />
                </div>
                <p className="text-[var(--text-secondary)]">
                  Cargando chats...
                </p>
              </div>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-4">
                <MessageCircle
                  size={40}
                  className="text-[var(--text-secondary)] mx-auto mb-2 opacity-30"
                />
                <p className="text-[var(--text-secondary)]">
                  No hay chats pendientes
                </p>
              </div>
            </div>
          ) : (
            chats.map((chat) => (
              <ChatCard
                key={chat.patientId}
                chat={chat}
                onClick={() => handleChatSelected(chat)}
                isSelected={selectedChat?.patientId === chat.patientId}
                isUnread={Boolean(
                  unreadById[chat.patientId] || unreadById[chat.patientPhone],
                )}
              />
            ))
          )}
        </div>
      </div>

      <ChatWindow
        selectedChat={selectedChat}
        isLoading={isLoading}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
}

export default ChatsListComponent;
