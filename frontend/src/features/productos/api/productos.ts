// Funciones HTTP del módulo de productos.
import { api } from "@/shared/api/axiosInstance";
import type {
  Producto,
  ProductoFormData,
  ProductosPaginados,
} from "../types/producto";

interface FiltrosProductos {
  skip?: number;
  limit?: number;
  search?: string;
  categoria_id?: number;
  disponible?: boolean;
}

interface CambioStockProducto {
  id: number;
  stock: number;
  disponible: boolean;
}

function armarCuerpoProducto(producto: ProductoFormData) {
  return {
    categoria_id: producto.categoria_id,
    nombre: producto.nombre,
    descripcion: producto.descripcion.trim() || null,
    precio_base: producto.precio_base,
    imagen_url: producto.imagen_url.trim() || null,
    stock: producto.stock,
    disponible: producto.disponible,
  };
}

export async function listarProductos(
  filtros: FiltrosProductos = {}
): Promise<ProductosPaginados> {
  const respuesta = await api.get<ProductosPaginados>("/productos", {
    params: {
      skip: filtros.skip,
      limit: filtros.limit,
      search: filtros.search || undefined,
      categoria_id: filtros.categoria_id,
      disponible: filtros.disponible,
    },
  });
  return respuesta.data;
}

export async function crearProducto(
  producto: ProductoFormData
): Promise<Producto> {
  const respuesta = await api.post<Producto>(
    "/productos",
    armarCuerpoProducto(producto)
  );
  return respuesta.data;
}

export async function actualizarProducto(
  producto: ProductoFormData & { id: number }
): Promise<Producto> {
  const respuesta = await api.put<Producto>(
    `/productos/${producto.id}`,
    armarCuerpoProducto(producto)
  );
  return respuesta.data;
}

export async function actualizarStockProducto({
  id,
  stock,
  disponible,
}: CambioStockProducto): Promise<Producto> {
  const respuesta = await api.patch<Producto>(
    `/productos/${id}/stock`,
    { stock, disponible }
  );
  return respuesta.data;
}

export async function eliminarProducto(
  productoId: number
): Promise<void> {
  await api.delete(`/productos/${productoId}`);
}
