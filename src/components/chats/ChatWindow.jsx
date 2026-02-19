import React, { useState, useContext, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { MainContext } from "../../context/MainContext";
import useApiMutation from "../../hocks/useApiMutation";
import whatsappSendService from "../../async/services/post/whatsappSendService";

function ChatWindow({ selectedChat, isLoading, onMessageSent }) {
  const [messageText, setMessageText] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState(null);
  const { user } = useContext(MainContext);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Hacer scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.allMessages, optimisticMessage]);

  // También scroll cuando se selecciona un chat diferente
  useEffect(() => {
    if (selectedChat) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedChat?.patientId]);

  const { mutate: sendMessage, isPending: isSending } = useApiMutation(
    whatsappSendService,
    {
      onSuccess: () => {
        setMessageText("");
        if (onMessageSent) {
          onMessageSent();
        }
      },
      onError: () => {
        // Si hay error, remover el mensaje optimista
        setOptimisticMessage(null);
      },
    },
  );

  // Limpiar el mensaje optimista cuando se reciben nuevos mensajes del servidor
  useEffect(() => {
    if (optimisticMessage && selectedChat?.allMessages) {
      // Verificar si el mensaje ya está en la lista del servidor
      const messageExists = selectedChat.allMessages.some(
        (msg) =>
          msg.message === optimisticMessage.message &&
          msg.direction === "OUTBOUND",
      );

      if (messageExists) {
        setOptimisticMessage(null);
      }
    }
  }, [selectedChat?.allMessages, optimisticMessage]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--color-background)]">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <MessageCircle size={40} className="text-[var(--color-primary)]" />
          </div>
          <p className="text-[var(--text-secondary)]">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-background)]">
        <MessageCircle
          size={48}
          className="text-[var(--text-secondary)] mb-4 opacity-30"
        />
        <p className="text-[var(--text-secondary)]">
          Selecciona un chat para ver los mensajes
        </p>
      </div>
    );
  }

  const patientName = `${selectedChat.patientInfo?.firstName || "Paciente"} ${
    selectedChat.patientInfo?.lastName || ""
  }`.trim();

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // Crear mensaje optimista
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      message: messageText.trim(),
      direction: "OUTBOUND",
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setOptimisticMessage(optimistic);

    const payload = {
      patientPhone: selectedChat.patientPhone,
      message: messageText.trim(),
      operatorId: user?.id || "",
      operatorName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    };

    sendMessage(payload);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col bg-[var(--color-background)]"
    >
      {/* Header */}
      <div className="border-b border-[var(--color-border)] p-4 bg-[var(--color-background-secondary)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {patientName}
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {selectedChat.patientPhone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-secondary)]">
              {selectedChat.messageCount} mensaje
              {selectedChat.messageCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedChat.allMessages && selectedChat.allMessages.length > 0 ? (
          <>
            {selectedChat.allMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.direction === "INBOUND"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                    message.direction === "INBOUND"
                      ? "bg-[var(--color-background-secondary)] text-[var(--text-primary)]"
                      : "bg-[var(--color-primary)] text-white"
                  }`}
                >
                  <p className="break-words text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.direction === "INBOUND"
                        ? "opacity-60"
                        : "opacity-80"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {optimisticMessage && (
              <div className="flex justify-end">
                <div className="max-w-xs px-4 py-2 rounded-2xl bg-[var(--color-primary)] text-white opacity-80">
                  <p className="break-words text-sm">
                    {optimisticMessage.message}
                  </p>
                  <p className="text-xs mt-1 opacity-80">Enviando...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--text-secondary)] opacity-50">
              Sin mensajes
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-background-secondary)]">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje... (Enter para enviar)"
            disabled={isSending}
            className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-background)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
            rows="3"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !messageText.trim()}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin">
                  <Send size={18} />
                </div>
              </>
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
