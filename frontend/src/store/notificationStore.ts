import { create } from "zustand";

interface NotificationStore {
  message: string;
  show: boolean;
  type?: "success" | "error" | "info";
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  message: "",
  show: false,
  type: "info",
  showNotification: (message: string, type: "success" | "error" | "info" = "info") =>
    set({ message, show: true, type }),
  hideNotification: () => set({ message: "", show: false }),
}));
