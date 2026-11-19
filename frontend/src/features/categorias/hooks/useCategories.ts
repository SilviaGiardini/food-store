import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { useNotificationStore } from "@/store/notificationStore";

import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
} from "../api/categorias";
import type { Categoria } from "../types/categoria";

// Categorías para el catálogo y para el ABM del panel.
export function useCategories() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  // La misma queryKey se invalida después de cada cambio.
  const query = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
  });

  // Si el backend rechaza el nombre, mostramos su mensaje.
  const crearMutation = useMutation({
    mutationFn: crearCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      showNotification("Categoría creada correctamente", "success");
    },
    onError: (error: unknown) => {
      let mensaje = "Error al crear la categoría";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, "error");
    },
  });

  // Editar puede chocar con otra categoría; el error se muestra igual.
  const editarMutation = useMutation({
    mutationFn: actualizarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      showNotification("Categoría modificada correctamente", "success");
    },
    onError: (error: unknown) => {
      let mensaje = "Error al editar la categoría";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, "error");
    },
  });

  // La baja es lógica: la categoría deja de aparecer en la lista.
  const eliminarMutation = useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      showNotification("Categoría eliminada correctamente", "success");
    },
    onError: (error: unknown) => {
      let mensaje = "Error al eliminar la categoría";
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        mensaje = String(error.response.data.detail);
      } else if (error instanceof Error) {
        mensaje = error.message;
      }
      showNotification(mensaje, "error");
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
