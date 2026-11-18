import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/shared/api/axiosInstance';
import { useNotificationStore } from '@/store/notificationStore';
import type { Producto, ProductoFormData } from '../types/producto';

// Custom hook de la feature Products: encapsula llamadas HTTP y TanStack Query
export function useProducts() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  // Consulta GET para obtener los productos
  const query = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: async () => {
      const res = await api.get<Producto[]>('/productos?limit=100');
      return res.data;
    },
  });

  // Mutación POST para crear un nuevo producto
  const crearMutation = useMutation({
    mutationFn: async (nuevoProducto: ProductoFormData) => {
      const res = await api.post<Producto>('/productos', {
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion ?? null,
        precio_base: nuevoProducto.precio_base,
        categoria_ids: nuevoProducto.categoria_ids,
        disponible: nuevoProducto.disponible ?? true,
        imagenes_url: nuevoProducto.imagenes_url ?? [],
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      showNotification('Producto creado correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al crear el producto';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  // Mutación PUT para modificar un producto existente
  const editarMutation = useMutation({
    mutationFn: async (producto: ProductoFormData & { id: number }) => {
      const res = await api.put<Producto>(`/productos/${producto.id}`, {
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? null,
        precio_base: producto.precio_base,
        categoria_ids: producto.categoria_ids,
        disponible: producto.disponible ?? true,
        imagenes_url: producto.imagenes_url ?? [],
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      showNotification('Producto modificado correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al editar el producto';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  // Mutación DELETE para eliminación lógica de un producto
  const eliminarMutation = useMutation({
    mutationFn: async (productoId: number) => {
      await api.delete(`/productos/${productoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      showNotification('Producto eliminado correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al eliminar el producto';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  return {
    productos: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    crearProducto: crearMutation.mutateAsync,
    editarProducto: editarMutation.mutateAsync,
    eliminarProducto: eliminarMutation.mutate,
  };
}

export default useProducts;

