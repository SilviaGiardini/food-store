// Pide los pedidos del usuario logueado.
import { useQuery } from "@tanstack/react-query";

import { listarPedidos } from "../api/pedidos";
import type { PedidosPaginados } from "../types/pedido";

const LIMITE_PEDIDOS = 100;

export function usePedidos() {
  const query = useQuery<PedidosPaginados>({
    queryKey: ["pedidos", "mis"],
    queryFn: () => listarPedidos({ limit: LIMITE_PEDIDOS }),
  });

  return {
    pedidos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    cargando: query.isPending,
    error: query.isError,
  };
}

export default usePedidos;
