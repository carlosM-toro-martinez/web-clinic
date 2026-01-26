import React from "react";
import { Send } from "lucide-react";

function MessageBubble({ message }) {
  const isInbound = message.direction === "INBOUND";

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isInbound ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          isInbound
            ? "bg-[var(--color-background-secondary)] text-[var(--text-primary)]"
            : "bg-[var(--color-primary)] text-white"
        }`}
      >
        <p className="break-words text-sm">{message.message}</p>
        <p
          className={`text-xs mt-1 ${isInbound ? "opacity-60" : "opacity-80"}`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
