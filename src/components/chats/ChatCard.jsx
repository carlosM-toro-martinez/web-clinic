import React from "react";
import { MessageCircle, Clock } from "lucide-react";

function ChatCard({ chat, onClick, isSelected }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString("es-ES", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const patientName = `${chat.patientInfo?.firstName || "Paciente"} ${
    chat.patientInfo?.lastName || ""
  }`.trim();

  const lastMessageText = chat.lastMessage?.text || "Sin mensajes";
  const lastMessageTime = formatTime(chat.lastMessage?.timestamp);

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b cursor-pointer transition-colors ${
        isSelected
          ? "bg-[var(--color-primary)] text-white"
          : "bg-[var(--color-background)] hover:bg-[var(--color-hover)] text-[var(--text-primary)]"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold truncate">{patientName}</h3>
        <span className="text-xs opacity-70">{lastMessageTime}</span>
      </div>

      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-sm truncate flex-1 ${isSelected ? "opacity-90" : "opacity-70"}`}
        >
          {lastMessageText}
        </p>
        {chat.isNew && (
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold animate-pulse ${
              isSelected
                ? "bg-white text-[var(--color-primary)]"
                : "bg-red-500 text-white"
            }`}
          >
            !
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
        <Phone size={14} />
        <span>{chat.patientPhone}</span>
      </div>
    </div>
  );
}

function Phone({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  );
}

export default ChatCard;
