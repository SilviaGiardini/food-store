// Lista todos los pedidos para el panel de administración.
import { useQuery } from "@tanstack/react-query";

import { listarPedidos } from "../api/pedidos";
import type {
  EstadoPedido,
  PedidosPaginados,
} from "../types/pedido";

const LIMITE_PEDIDOS = 100;

// Trae los pedidos que ve el administrador.
export function useAdminPedidos(estado?: EstadoPedido) {
  const query = useQuery<PedidosPaginados>({
    queryKey: ["pedidos", "admin", estado ?? "todos"],
    queryFn: () =>
      listarPedidos({
        limit: LIMITE_PEDIDOS,
        estado,
      }),
  });

  return {
    pedidos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    cargando: query.isPending,
    error: query.isError,
  };
}

export default useAdminPedidos;
