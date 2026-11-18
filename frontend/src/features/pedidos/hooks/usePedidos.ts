// Pide los pedidos del usuario logueado.
import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/axiosInstance";
import type { PedidosPaginados } from "../types/pedido";

const LIMITE_PEDIDOS = 100;

export function usePedidos() {
  const query = useQuery<PedidosPaginados>({
    queryKey: ["pedidos", "mis"],
    queryFn: async () => {
      const respuesta = await api.get<PedidosPaginados>("/pedidos", {
        params: { limit: LIMITE_PEDIDOS },
      });
      return respuesta.data;
    },
  });

  return {
    pedidos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    cargando: query.isPending,
    error: query.isError,
  };
}

export default usePedidos;
