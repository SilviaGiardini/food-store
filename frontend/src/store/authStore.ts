import { create } from "zustand";
import axios from "axios";
import { api } from "@/shared/api/axiosInstance";
import type { UsuarioAuth } from "@/features/auth/types/auth.types";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: UsuarioAuth | null;
  status: AuthStatus;
  procesandoLogin: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (...roles: string[]) => boolean;
  limpiarError: () => void;
  limpiarSesion: () => void;
}

// Store global de autenticación gestionado con Zustand sin persistencia en storage.
// La sesión se valida directamente contra el backend mediante la cookie HttpOnly.
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: "checking",
  procesandoLogin: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ procesandoLogin: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      await api.post("/auth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      await get().checkAuth();
    } catch (err: unknown) {
      let mensaje = "Error al iniciar sesión";
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.detail) {
          mensaje =
            typeof err.response.data.detail === "string"
              ? err.response.data.detail
              : "Credenciales inválidas";
        } else if (!err.response) {
          mensaje = "No se pudo conectar con el servidor";
        }
      } else if (err instanceof Error) {
        mensaje = err.message;
      }
      set({ user: null, status: "unauthenticated", error: mensaje });
      throw err;
    } finally {
      set({ procesandoLogin: false });
    }
  },

  limpiarSesion: () => {
    set({
      user: null,
      status: "unauthenticated",
      error: null,
    });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignoramos error del servidor al desloguear
    } finally {
      get().limpiarSesion();
    }
  },

  checkAuth: async () => {
    try {
      const res = await api.get<UsuarioAuth>("/auth/me");
      set({
        user: res.data,
        status: "authenticated",
      });
    } catch {
      set({
        user: null,
        status: "unauthenticated",
      });
    }
  },

  hasRole: (...roles: string[]) => {
    const user = get().user;
    if (!user) return false;
    if (user.roles && Array.isArray(user.roles)) {
      return roles.some((rol) => user.roles.includes(rol));
    }
    return false;
  },

  limpiarError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
