import axios from "axios";

import { api } from "./axiosInstance";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

const RUTAS_DE_AUTH = ["/auth/token", "/auth/me"];

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(error);
      }

      const url: string = error.config?.url ?? "";
      const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta));
      const detalle: unknown = error.response?.data?.detail;
      const cuentaDesactivada =
        error.response?.status === 400 &&
        detalle === "Cuenta de usuario desactivada";

      if (
        (error.response?.status === 401 && !esDeAuth) ||
        cuentaDesactivada
      ) {
        useAuthStore.getState().limpiarSesion();
      }

      if (error.response?.status === 403) {
        useNotificationStore
          .getState()
          .showNotification(
            "Acceso denegado: no tenés permisos para esta acción",
            "error"
          );
      }

      return Promise.reject(error);
    }
  );
};

setupInterceptors();
