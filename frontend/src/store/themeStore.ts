import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleTheme: () =>
        set((state) => {
          const nuevo = !state.darkMode;
          document.documentElement.classList.toggle("dark", nuevo);
          return { darkMode: nuevo };
        }),
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.classList.toggle("dark", state.darkMode);
        }
      },
    }
  )
);
