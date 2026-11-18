// Cancela un pedido pendiente y refresca la lista.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { cancelarPedido } from "../api/pedidos";

export function useCancelarPedido() {
  const queryClient = useQueryClient();
  const mostrarNotificacion = useNotificationStore(
    (state) => state.showNotification
  );

  return useMutation({
    // El backend valida que el pedido sea del usuario y que siga pendiente.
    mutationFn: cancelarPedido,
    // Si salió bien, cambió el pedido y el stock volvió al catálogo.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["catalogo-productos"] });
      mostrarNotificacion("Pedido cancelado correctamente", "success");
    },
    // Mostramos el mensaje que devuelve el backend en el toast.
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "No se pudo cancelar el pedido"),
        "error"
      );
    },
  });
}

export default useCancelarPedido;
