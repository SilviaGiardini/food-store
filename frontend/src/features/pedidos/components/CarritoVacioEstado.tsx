// Estado que se muestra cuando el carrito no tiene productos.
import { Link } from "react-router-dom";

import carritoVacio from "@/assets/carrito-vacio.png";

export function CarritoVacioEstado() {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <img
        src={carritoVacio}
        alt="Carrito de compras vacío"
        className="w-52 sm:w-64 h-auto"
      />

      <p className="mt-4 text-base font-semibold text-gray-700">
        Tu carrito está vacío.
      </p>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Agregá productos del catálogo para empezar tu pedido.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Ver catálogo
      </Link>
    </div>
  );
}

export default CarritoVacioEstado;
