// Pide productos paginados con búsqueda y filtros para el catálogo.
import { useQuery } from "@tanstack/react-query";

import { listarProductos } from "../api/productos";
import type { ProductosPaginados } from "../types/producto";

export interface FiltrosCatalogo {
  skip: number;
  limit: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}

export function useCatalogoProductos(filtros: FiltrosCatalogo) {
  const query = useQuery<ProductosPaginados>({
    queryKey: [
      "catalogo-productos",
      filtros.skip,
      filtros.limit,
      filtros.search ?? "",
      filtros.categoria_id ?? null,
      filtros.disponible ?? null,
    ],
    queryFn: () => listarProductos(filtros),
  });

  return {
    productos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    cargando: query.isPending,
    error: query.isError,
  };
}

export default useCatalogoProductos;
