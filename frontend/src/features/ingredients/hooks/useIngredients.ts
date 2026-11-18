import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/shared/api/api';
import { useNotificationStore } from '@/store/notificationStore';
import type { Ingrediente, IngredienteFormData } from '../types/ingrediente';

// Custom hook de la feature Ingredients: encapsula llamadas HTTP y TanStack Query
export function useIngredients() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  // Consulta GET para obtener los ingredientes
  const query = useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const res = await api.get<Ingrediente[]>('/ingredientes/?limit=100');
      return res.data;
    },
  });

  // Mutación POST para crear un nuevo ingrediente
  const crearMutation = useMutation({
    mutationFn: async (nuevo: IngredienteFormData) => {
      const res = await api.post<Ingrediente>('/ingredientes/', {
        nombre: nuevo.nombre.trim(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      showNotification('Ingrediente creado correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al crear el ingrediente';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  // Mutación PUT para modificar un ingrediente existente
  const editarMutation = useMutation({
    mutationFn: async (ingrediente: IngredienteFormData & { id: number }) => {
      const res = await api.put<Ingrediente>(`/ingredientes/${ingrediente.id}`, {
        nombre: ingrediente.nombre.trim(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      showNotification('Ingrediente modificado correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al editar el ingrediente';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  // Mutación DELETE para eliminar un ingrediente
  const eliminarMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ingredientes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      showNotification('Ingrediente eliminado correctamente', 'success');
    },
    onError: (error: unknown) => {
      let mensaje = 'Error al eliminar el ingrediente';
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, 'error');
    },
  });

  return {
    ingredientes: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    crearIngrediente: crearMutation.mutateAsync,
    editarIngrediente: editarMutation.mutateAsync,
    eliminarIngrediente: eliminarMutation.mutate,
  };
}

export default useIngredients;

