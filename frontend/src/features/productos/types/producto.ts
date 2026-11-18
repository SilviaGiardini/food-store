// Tipos de productos: catálogo público y formulario de administración.
import type { Categoria } from "@/features/categorias";

export interface ProductoCatalogo {
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

export interface ProductosPaginados {
  total: number;
  items: ProductoCatalogo[];
}

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