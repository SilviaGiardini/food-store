// Maneja la sesión: login, logout y recuperación del usuario logueado.
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { handleApiError } from "@/shared/api/handleApiError";
import {
  cerrarSesion,
  iniciarSesion,
  obtenerUsuarioActual,
} from "@/features/auth/api/auth";
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
          await iniciarSesion(username, password);

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
          await cerrarSesion();
        } catch {
          // Si el servidor falla, igual cerramos la sesión local.
        } finally {
          get().limpiarSesion();
        }
      },

      checkSession: async () => {
        try {
          const usuario = await obtenerUsuarioActual();
          set({ usuario, cargando: false });
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
