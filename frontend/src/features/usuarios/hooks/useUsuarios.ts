// Consulta y cambia el estado de los usuarios desde el panel admin.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api } from "@/shared/api/axiosInstance";
import { useNotificationStore } from "@/store/notificationStore";
import type { UsuarioAdmin } from "../types/usuario";

// Trae la lista de usuarios y prepara la acción para activarlos o desactivarlos.
export function useUsuarios() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  // Pide al backend todos los usuarios.
  const query = useQuery<UsuarioAdmin[]>({
    queryKey: ["admin-usuarios"],
    queryFn: async () => {
      const res = await api.get<UsuarioAdmin[]>("/admin/usuarios");
      return res.data;
    },
  });

  // Activa o desactiva una cuenta y después refresca la lista.
  const toggleMutation = useMutation({
    mutationFn: async ({ id, estaActivo }: { id: number; estaActivo: boolean }) => {
      const endpoint = estaActivo
        ? `/admin/usuarios/${id}/desactivar`
        : `/admin/usuarios/${id}/activar`;
      await api.post(endpoint);
      return { id, estaActivo };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-usuarios"] });
      showNotification(
        variables.estaActivo
          ? "Usuario desactivado correctamente"
          : "Usuario activado correctamente",
        "success"
      );
    },
    onError: (err: unknown) => {
      let mensaje = "No se pudo cambiar el estado del usuario";
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        mensaje = String(err.response.data.detail);
      } else if (err instanceof Error) {
        mensaje = err.message;
      }
      showNotification(mensaje, "error");
    },
  });

  // Decide qué endpoint usar según si el usuario está activo o no.
  const toggleEstadoUsuario = (id: number, estaActivo: boolean) => {
    toggleMutation.mutate({ id, estaActivo });
  };

  // Guarda el id que se está procesando para deshabilitar solo esa fila.
  const procesandoId = toggleMutation.isPending ? toggleMutation.variables?.id ?? null : null;

  // Si la consulta falla, guardamos un mensaje para mostrarlo en pantalla.
  let errorMensaje: string | null = null;
  if (query.isError) {
    const es403 = axios.isAxiosError(query.error) && query.error.response?.status === 403;
    if (!es403) {
      if (axios.isAxiosError(query.error) && query.error.response?.data?.detail) {
        errorMensaje = String(query.error.response.data.detail);
      } else if (query.error instanceof Error) {
        errorMensaje = query.error.message;
      } else {
        errorMensaje = "Error al obtener la lista de usuarios";
      }
    }
  }

  return {
    usuarios: query.data ?? [],
    cargando: query.isLoading,
    actualizando: query.isFetching,
    error: errorMensaje,
    procesandoId,
    toggleEstadoUsuario,
    recargar: () => query.refetch(),
  };
}

export default useUsuarios;
