// Maneja la sesión: login, logout y recuperación del usuario logueado.
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { api } from "@/shared/api/axiosInstance";
import { handleApiError } from "@/shared/api/handleApiError";
import type { UsuarioAuth } from "@/features/auth/types/auth.types";

export interface AuthState {
  usuario: UsuarioAuth | null;
  cargando: boolean;
  procesandoLogin: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
  limpiarError: () => void;
  limpiarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      cargando: true,
      procesandoLogin: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ procesandoLogin: true, error: null });
        try {
          const params = new URLSearchParams();
          params.append("username", username);
          params.append("password", password);

          await api.post("/auth/token", params, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          await get().checkSession();
          if (!get().usuario) {
            throw new Error("No se pudo recuperar la sesión");
          }
        } catch (err: unknown) {
          const mensaje = handleApiError(
            err,
            "Error al iniciar sesión"
          );
          set({ usuario: null, cargando: false, error: mensaje });
          throw err;
        } finally {
          set({ procesandoLogin: false });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {
          // Si el servidor falla, igual cerramos la sesión local.
        } finally {
          get().limpiarSesion();
        }
      },

      checkSession: async () => {
        try {
          const res = await api.get<UsuarioAuth>("/auth/me");
          set({ usuario: res.data, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },

      hasRole: (...roles: string[]) => {
        const usuario = get().usuario;
        return usuario ? roles.includes(usuario.role) : false;
      },

      limpiarError: () => {
        set({ error: null });
      },

      limpiarSesion: () => {
        set({ usuario: null, cargando: false, error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ usuario: state.usuario }),
    }
  )
);

export default useAuthStore;
