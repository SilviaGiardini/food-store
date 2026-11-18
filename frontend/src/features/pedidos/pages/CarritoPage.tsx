// Página del carrito: ítems, cantidades y total.
import { Link } from "react-router-dom";

import { useCartStore } from "@/store/cartStore";
import { CarritoVacioEstado } from "../components/CarritoVacioEstado";

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default function CarritoPage() {
  const items = useCartStore((state) => state.items);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const quitar = useCartStore((state) => state.quitar);
  const vaciar = useCartStore((state) => state.vaciar);
  const total = useCartStore((state) => state.total());

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Carrito</h1>
        <CarritoVacioEstado />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Carrito</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.producto_id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-800">
                {item.nombre}
              </h2>
              <p className="text-sm text-gray-500">
                {formatoPrecio.format(item.precio_unitario)} c/u
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  cambiarCantidad(item.producto_id, item.cantidad - 1)
                }
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold cursor-pointer hover:bg-gray-50"
                aria-label={`Quitar una unidad de ${item.nombre}`}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-800">
                {item.cantidad}
              </span>
              <button
                type="button"
                onClick={() =>
                  cambiarCantidad(item.producto_id, item.cantidad + 1)
                }
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold cursor-pointer hover:bg-gray-50"
                aria-label={`Agregar una unidad de ${item.nombre}`}
              >
                +
              </button>
            </div>

            <div className="sm:w-32 sm:text-right">
              <p className="text-sm font-semibold text-gray-800">
                {formatoPrecio.format(
                  item.precio_unitario * item.cantidad
                )}
              </p>
              <button
                type="button"
                onClick={() => quitar(item.producto_id)}
                className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatoPrecio.format(total)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Link
            to="/"
            className="flex-1 text-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
          >
            Seguir comprando
          </Link>
          <Link
            to="/checkout"
            className="flex-1 text-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Ir al checkout
          </Link>
        </div>

        <button
          type="button"
          onClick={vaciar}
          className="mt-4 text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
        >
          Vaciar carrito
        </button>
      </div>
    </main>
  );
}
