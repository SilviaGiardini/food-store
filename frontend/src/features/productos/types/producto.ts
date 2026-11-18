import type { Categoria } from "@/features/categorias";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  imagenes_url: string[];
  disponible: boolean;
  categorias?: Categoria[];
}

export interface ProductoFormData {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  disponible?: boolean;
  categoria_ids: number[];
  imagenes_url?: string[];
}