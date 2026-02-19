import React from "react";

function ChatCard({ chat, onClick, isSelected, isUnread }) {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
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
  const unreadCount = Number(chat.unreadCount || 0);
  const showUnread = !isSelected && (unreadCount > 0 || isUnread);

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b cursor-pointer transition-colors ${
        isSelected
          ? "bg-[var(--color-primary)] text-white"
          : `bg-[var(--color-background)] hover:bg-[var(--color-hover)] text-[var(--text-primary)] ${
              showUnread ? "border-l-4 border-l-[var(--color-primary)]" : ""
            }`
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
        {showUnread && (
          <span
            className={`inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full text-xs font-bold ${
              isSelected
                ? "bg-white text-[var(--color-primary)]"
                : "bg-[var(--color-primary)] text-white"
            }`}
          >
            {unreadCount > 0 ? unreadCount : "•"}
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
