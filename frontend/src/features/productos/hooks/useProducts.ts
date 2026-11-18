// Hook del panel admin: lista, crea, edita, elimina y ajusta stock.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api/axiosInstance";
import { handleApiError } from "@/shared/api/handleApiError";
import { useNotificationStore } from "@/store/notificationStore";
import type {
  Producto,
  ProductoFormData,
  ProductosPaginados,
} from "../types/producto";

interface ActualizarStockData {
  id: number;
  stock: number;
  disponible: boolean;
}

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
    queryFn: async () => {
      const respuesta = await api.get<ProductosPaginados>("/productos", {
        params: { limit: 100 },
      });
      return respuesta.data;
    },
  });

  // Crea un producto y avisa si salió bien.
  const crearMutation = useMutation({
    mutationFn: async (nuevoProducto: ProductoFormData) => {
      const respuesta = await api.post<Producto>("/productos", {
        categoria_id: nuevoProducto.categoria_id,
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion.trim() || null,
        precio_base: nuevoProducto.precio_base,
        imagen_url: nuevoProducto.imagen_url.trim() || null,
        stock: nuevoProducto.stock,
        disponible: nuevoProducto.disponible,
      });
      return respuesta.data;
    },
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
    mutationFn: async (producto: ProductoFormData & { id: number }) => {
      const respuesta = await api.put<Producto>(
        `/productos/${producto.id}`,
        {
          categoria_id: producto.categoria_id,
          nombre: producto.nombre,
          descripcion: producto.descripcion.trim() || null,
          precio_base: producto.precio_base,
          imagen_url: producto.imagen_url.trim() || null,
          stock: producto.stock,
          disponible: producto.disponible,
        }
      );
      return respuesta.data;
    },
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
    mutationFn: async (productoId: number) => {
      await api.delete(`/productos/${productoId}`);
    },
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
    mutationFn: async ({ id, stock, disponible }: ActualizarStockData) => {
      const respuesta = await api.patch<Producto>(
        `/productos/${id}/stock`,
        { stock, disponible }
      );
      return respuesta.data;
    },
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
    total: query.data?.total ?? 0,
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
