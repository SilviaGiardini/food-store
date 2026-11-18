// Tipos de productos: catálogo, panel admin y formulario.
import type { Categoria } from "@/features/categorias";

export interface Producto {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria: Categoria;
}

export type ProductoCatalogo = Producto;

export interface ProductosPaginados {
  total: number;
  items: Producto[];
}

export interface ProductoFormData {
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagen_url: string;
  stock: number;
  disponible: boolean;
}
