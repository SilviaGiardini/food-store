import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNotificationStore } from '@/store/notificationStore';
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from '../api/categorias';
import type { Categoria } from '../types/categoria';

// Custom hook de la feature Categories: encapsula llamadas HTTP y TanStack Query
export function useCategories() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  // Consulta GET para obtener las categorías
  const query = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
  });

  // Mutación POST para crear una nueva categoría
  const crearMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      showNotification('Categoría creada correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al crear la categoría';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  // Mutación PUT para modificar una categoría existente
  const editarMutation = useMutation({
    mutationFn: actualizarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      showNotification('Categoría modificada correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al editar la categoría';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  // Mutación DELETE para eliminación lógica de categoría
  const eliminarMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      showNotification('Categoría eliminada correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al eliminar la categoría';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  return {
    categorias: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    crearCategoria: crearMutation.mutateAsync,
    editarCategoria: editarMutation.mutateAsync,
    eliminarCategoria: eliminarMutation.mutate,
  };
}

export default useCategories;

