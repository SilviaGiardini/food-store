// Crea un pedido y vacía el carrito si sale bien.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api/axiosInstance";
import { useCartStore } from "@/store/cartStore";
import type { Pedido, PedidoCreate } from "../types/pedido";

export function useCrearPedido() {
  // Permite avisarle a TanStack Query que los pedidos cambiaron.
  const queryClient = useQueryClient();
  const vaciar = useCartStore((state) => state.vaciar);

  return useMutation({
    // Mandamos el pedido al backend y devolvemos la respuesta ya tipada.
    mutationFn: async (datos: PedidoCreate) => {
      const respuesta = await api.post<Pedido>("/pedidos", datos);
      return respuesta.data;
    },
    // Si el backend confirmó el pedido, vaciamos el carrito y refrescamos la lista.
    onSuccess: () => {
      vaciar();
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}

export default useCrearPedido;
