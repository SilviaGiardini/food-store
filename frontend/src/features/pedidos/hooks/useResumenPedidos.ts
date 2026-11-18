// Pide el resumen de pedidos para el panel de administración.
import { useQuery } from "@tanstack/react-query";

import { obtenerResumenPedidos } from "../api/pedidos";
import type { ResumenPedidos } from "../types/pedido";

// Trae los números que se muestran en las tarjetas del resumen.
export function useResumenPedidos() {
  const query = useQuery<ResumenPedidos>({
    queryKey: ["pedidos", "resumen"],
    queryFn: obtenerResumenPedidos,
  });

  return {
    resumen: query.data,
    cargando: query.isPending,
    error: query.isError,
  };
}

export default useResumenPedidos;
