// Funciones HTTP del módulo de categorías.
import { api } from "@/shared/api/axiosInstance";
import type { Categoria } from "../types/categoria";

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
}

export async function listarCategorias(): Promise<Categoria[]> {
  const respuesta = await api.get<Categoria[]>("/categorias?limit=100");
  return respuesta.data;
}

export async function crearCategoria(
  datos: CategoriaFormData
): Promise<Categoria> {
  const respuesta = await api.post<Categoria>("/categorias", datos);
  return respuesta.data;
}

export async function actualizarCategoria(
  categoria: Categoria
): Promise<Categoria> {
  const respuesta = await api.put<Categoria>(
    `/categorias/${categoria.id}`,
    {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
      activo: categoria.activo,
    }
  );
  return respuesta.data;
}

export async function eliminarCategoria(
  categoriaId: number
): Promise<void> {
  await api.delete(`/categorias/${categoriaId}`);
}
