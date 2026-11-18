// Tarjeta de producto del catálogo con botón para agregar al carrito.
import { useCartStore } from "@/store/cartStore";
import type { ProductoCatalogo } from "../types/producto";

interface ProductoCardProps {
  producto: ProductoCatalogo;
}

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCartStore((state) => state.agregar);

  const sinStock = producto.stock <= 0;
  const noDisponible = !producto.disponible;
  const deshabilitado = sinStock || noDisponible;

  const handleAgregar = () => {
    agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
    });
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-orange-50 flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-orange-600">
          {producto.categoria.nombre}
        </span>
        <h2 className="text-lg font-bold text-gray-800 mt-1">
          {producto.nombre}
        </h2>
        <p className="text-sm text-gray-500 mt-1 flex-1">
          {producto.descripcion ?? "Sin descripción."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {formatoPrecio.format(producto.precio_base)}
          </span>
          <span
            className={`text-xs font-medium ${
              deshabilitado ? "text-red-500" : "text-gray-400"
            }`}
          >
            {noDisponible
              ? "No disponible"
              : sinStock
              ? "Sin stock"
              : `Stock: ${producto.stock}`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAgregar}
          disabled={deshabilitado}
          className="w-full mt-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductoCard;
