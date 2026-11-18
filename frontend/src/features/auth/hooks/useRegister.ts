// Envía el registro de un usuario nuevo.
import { useState } from "react";
import axios from "axios";
import { api } from "@/shared/api/axiosInstance";
import { useNotificationStore } from "@/store/notificationStore";
import type { RegistroUsuario } from "../types/auth.types";

export function useRegister() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showNotification = useNotificationStore((state) => state.showNotification);

  const registrar = async (datos: RegistroUsuario): Promise<boolean> => {
    setError(null);
    setCargando(true);

    try {
      await api.post("/auth/register", {
        username: datos.username.trim(),
        full_name: datos.full_name.trim(),
        email: datos.email.trim(),
        password: datos.password,
      });

      showNotification("Cuenta creada exitosamente. Ya puedes iniciar sesión.", "success");
      return true;
    } catch (err: unknown) {
      let mensaje = "Error al registrar la cuenta";
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.detail) {
          const detail = err.response.data.detail;
          if (typeof detail === "string") {
            mensaje = detail;
          } else if (Array.isArray(detail)) {
            mensaje = detail
              .map((d: { msg?: string }) => d.msg ?? "Validación fallida")
              .join(", ");
          }
        } else if (!err.response) {
          mensaje = "No se pudo conectar con el servidor";
        }
      } else if (err instanceof Error) {
        mensaje = err.message;
      }
      setError(mensaje);
      return false;
    } finally {
      setCargando(false);
    }
  };

  return { registrar, cargando, error };
}

export default useRegister;
