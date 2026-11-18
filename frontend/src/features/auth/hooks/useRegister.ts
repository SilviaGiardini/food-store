// Envía el registro de un usuario nuevo con useMutation.
import { useMutation } from "@tanstack/react-query";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { registrarUsuario } from "../api/auth";

export function useRegister() {
  const mostrarNotificacion = useNotificationStore(
    (state) => state.showNotification
  );

  const mutation = useMutation({
    // Manda los datos al backend y devuelve la respuesta.
    mutationFn: registrarUsuario,
    // Si el registro salió bien, avisamos y dejamos que la página navegue.
    onSuccess: () => {
      mostrarNotificacion(
        "Cuenta creada exitosamente. Ya puedes iniciar sesión.",
        "success"
      );
    },
    // Si falla, mostramos el mensaje del backend.
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "Error al registrar la cuenta"),
        "error"
      );
    },
  });

  return {
    registrar: mutation.mutateAsync,
    cargando: mutation.isPending,
    error: mutation.error
      ? handleApiError(mutation.error, "Error al registrar la cuenta")
      : null,
  };
}

export default useRegister;
