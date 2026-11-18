// Cambia el estado de un pedido desde el panel de administración.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import { cambiarEstadoPedido } from "../api/pedidos";
import type { EstadoPedido } from "../types/pedido";

interface CambioEstadoPedido {
  pedidoId: number;
  estado: EstadoPedido;
}

// Devuelve la acción que usa la tabla para mover un pedido de estado.
export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();
  const mostrarNotificacion = useNotificationStore(
    (state) => state.showNotification
  );

  return useMutation({
    // El backend valida la transición permitida según el estado actual.
    mutationFn: ({ pedidoId, estado }: CambioEstadoPedido) =>
      cambiarEstadoPedido(pedidoId, estado),
    // Refrescamos pedidos y resumen; si se canceló, también cambió el stock.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["catalogo-productos"] });
      mostrarNotificacion("Estado del pedido actualizado", "success");
    },
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "No se pudo cambiar el estado del pedido"),
        "error"
      );
    },
  });
}

export default useCambiarEstadoPedido;
