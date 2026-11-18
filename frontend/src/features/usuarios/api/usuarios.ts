// Funciones HTTP del módulo de usuarios.
import { api } from "@/shared/api/axiosInstance";
import type { UsuarioAdmin } from "../types/usuario";

export async function listarUsuarios(): Promise<UsuarioAdmin[]> {
  const respuesta = await api.get<UsuarioAdmin[]>("/admin/usuarios");
  return respuesta.data;
}

export async function cambiarEstadoUsuario(
  usuarioId: number,
  estaActivo: boolean
): Promise<UsuarioAdmin> {
  const endpoint = estaActivo
    ? `/admin/usuarios/${usuarioId}/desactivar`
    : `/admin/usuarios/${usuarioId}/activar`;

  const respuesta = await api.post<UsuarioAdmin>(endpoint);
  return respuesta.data;
}
