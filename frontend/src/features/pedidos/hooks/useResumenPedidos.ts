// Pide el resumen de pedidos para el panel de administración.
import { useQuery } from "@tanstack/react-query";

import { api } from "@/shared/api/axiosInstance";
import type { ResumenPedidos } from "../types/pedido";

// Trae los números que se muestran en las tarjetas del resumen.
export function useResumenPedidos() {
  const query = useQuery<ResumenPedidos>({
    queryKey: ["pedidos", "resumen"],
    queryFn: async () => {
      const respuesta = await api.get<ResumenPedidos>("/pedidos/resumen");
      return respuesta.data;
    },
  });

  return {
    resumen: query.data,
    cargando: query.isPending,
    error: query.isError,
  };
}

export default useResumenPedidos;
