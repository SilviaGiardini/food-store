// Crea un pedido y vacía el carrito si sale bien.
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCartStore } from "@/store/cartStore";
import { crearPedido } from "../api/pedidos";

export function useCrearPedido() {
  // Permite avisarle a TanStack Query que los pedidos cambiaron.
  const queryClient = useQueryClient();
  const vaciar = useCartStore((state) => state.vaciar);

  return useMutation({
    // Mandamos el pedido al backend y devolvemos la respuesta ya tipada.
    mutationFn: crearPedido,
    // Si el backend confirmó el pedido, vaciamos el carrito y refrescamos la lista.
    onSuccess: () => {
      vaciar();
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["catalogo-productos"] });
    },
  });
}

export default useCrearPedido;
