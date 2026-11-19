// Consultas y acciones que usa la tabla del panel.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import {
  actualizarProducto,
  actualizarStockProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from "../api/productos";
import type { ProductosPaginados } from "../types/producto";

// El panel pide 100 porque la tabla pagina en el cliente.
export function useProducts() {
  const queryClient = useQueryClient();
  const mostrarNotificacion = useNotificationStore(
    (state) => state.showNotification
  );

  // El catálogo usa otra queryKey, por eso invalidamos las dos.
  const invalidarProductos = () => {
    queryClient.invalidateQueries({ queryKey: ["productos"] });
    queryClient.invalidateQueries({ queryKey: ["catalogo-productos"] });
  };

  const query = useQuery<ProductosPaginados>({
    queryKey: ["productos", "admin"],
    queryFn: () => listarProductos({ limit: 100 }),
  });

  // Después de crear, la tabla se refresca con la invalidación.
  const crearMutation = useMutation({
    mutationFn: crearProducto,
    onSuccess: () => {
      invalidarProductos();
      mostrarNotificacion("Producto creado correctamente", "success");
    },
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "No se pudo crear el producto"),
        "error"
      );
    },
  });

  // El formulario manda todos los campos, por eso usamos PUT.
  const editarMutation = useMutation({
    mutationFn: actualizarProducto,
    onSuccess: () => {
      invalidarProductos();
      mostrarNotificacion("Producto modificado correctamente", "success");
    },
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "No se pudo modificar el producto"),
        "error"
      );
    },
  });

  // No se borra la fila: se marca como inactiva.
  const eliminarMutation = useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => {
      invalidarProductos();
      mostrarNotificacion("Producto eliminado correctamente", "success");
    },
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "No se pudo eliminar el producto"),
        "error"
      );
    },
  });

  // Stock y disponibilidad se actualizan juntos en el PATCH.
  const actualizarStockMutation = useMutation({
    mutationFn: actualizarStockProducto,
    onSuccess: () => {
      invalidarProductos();
      mostrarNotificacion("Stock actualizado correctamente", "success");
    },
    onError: (error: unknown) => {
      mostrarNotificacion(
        handleApiError(error, "No se pudo actualizar el stock"),
        "error"
      );
    },
  });

  const actualizandoId = actualizarStockMutation.isPending
    ? actualizarStockMutation.variables?.id ?? null
    : null;

  return {
    productos: query.data?.items ?? [],
    isPending: query.isPending,
    isError: query.isError,
    crearProducto: crearMutation.mutateAsync,
    editarProducto: editarMutation.mutateAsync,
    eliminarProducto: eliminarMutation.mutate,
    actualizarStock: actualizarStockMutation.mutate,
    actualizandoId,
  };
}

export default useProducts;
