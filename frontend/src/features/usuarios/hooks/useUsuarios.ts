// Lista de cuentas y acción para activarlas o desactivarlas.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNotificationStore } from "@/store/notificationStore";
import {
  cambiarEstadoUsuario,
  listarUsuarios,
} from "../api/usuarios";
import type { UsuarioAdmin } from "../types/usuario";

// El panel necesita ver también las cuentas desactivadas.
export function useUsuarios() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  // Una sola queryKey para que la tabla se refresque después de cada cambio.
  const query = useQuery<UsuarioAdmin[]>({
    queryKey: ["admin-usuarios"],
    queryFn: listarUsuarios,
  });

  // El cambio se hace contra el endpoint de activar o desactivar.
  const toggleMutation = useMutation({
    mutationFn: async ({ id, estaActivo }: { id: number; estaActivo: boolean }) => {
      await cambiarEstadoUsuario(id, estaActivo);
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

  // La tabla decide si corresponde activar o desactivar.
  const toggleEstadoUsuario = (id: number, estaActivo: boolean) => {
    toggleMutation.mutate({ id, estaActivo });
  };

  // Solo deshabilitamos la fila que se está actualizando.
  const procesandoId = toggleMutation.isPending ? toggleMutation.variables?.id ?? null : null;

  // El 403 ya lo muestra el interceptor; acá no lo duplicamos.
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
