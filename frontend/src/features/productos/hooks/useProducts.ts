// Hook del panel admin: lista, crea, edita, elimina y ajusta stock.
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

// Agrupa las consultas y acciones del panel de productos.
export function useProducts() {
  const queryClient = useQueryClient();
  const mostrarNotificacion = useNotificationStore(
    (state) => state.showNotification
  );

  // Cuando cambia un producto, refrescamos el panel y también el catálogo.
  const invalidarProductos = () => {
    queryClient.invalidateQueries({ queryKey: ["productos"] });
    queryClient.invalidateQueries({ queryKey: ["catalogo-productos"] });
  };

  const query = useQuery<ProductosPaginados>({
    queryKey: ["productos", "admin"],
    queryFn: () => listarProductos({ limit: 100 }),
  });

  // Crea un producto y avisa si salió bien.
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

  // Actualiza todos los datos del producto.
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

  // Hace la baja lógica del producto.
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

  // Cambia stock y disponibilidad desde los controles de la tabla.
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
