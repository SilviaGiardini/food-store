import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export function Toast() {
  const message = useNotificationStore((state) => state.message);
  const show = useNotificationStore((state) => state.show);
  const type = useNotificationStore((state) => state.type);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(hideNotification, 3000);
    return () => clearTimeout(timer);
  }, [show, message, hideNotification]);

  if (!show) return null;

  const bgColors = {
    success: "bg-emerald-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-slate-800 text-white",
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg transition-all ${
        bgColors[type ?? "info"]
      }`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={hideNotification}
        className="text-white/80 hover:text-white font-bold cursor-pointer text-xs ml-2"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
