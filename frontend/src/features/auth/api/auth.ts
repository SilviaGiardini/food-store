// Funciones HTTP del módulo de autenticación.
import { api } from "@/shared/api/axiosInstance";
import type { RegistroUsuario, UsuarioAuth } from "../types/auth.types";

export async function iniciarSesion(
  username: string,
  password: string
): Promise<void> {
  const datos = new URLSearchParams();
  datos.append("username", username);
  datos.append("password", password);

  await api.post("/auth/token", datos, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export async function cerrarSesion(): Promise<void> {
  await api.post("/auth/logout");
}

export async function obtenerUsuarioActual(): Promise<UsuarioAuth> {
  const respuesta = await api.get<UsuarioAuth>("/auth/me");
  return respuesta.data;
}

export async function registrarUsuario(
  datos: RegistroUsuario
): Promise<UsuarioAuth> {
  const respuesta = await api.post<UsuarioAuth>("/auth/register", {
    username: datos.username.trim(),
    full_name: datos.full_name.trim(),
    email: datos.email.trim(),
    password: datos.password,
  });
  return respuesta.data;
}
