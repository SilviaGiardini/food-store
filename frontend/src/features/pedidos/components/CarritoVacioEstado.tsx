// Estado que se muestra cuando el carrito no tiene productos.
import { Link } from "react-router-dom";

interface CarritoVacioIlustracionProps {
  className?: string;
}

function CarritoVacioIlustracion({
  className = "w-52 sm:w-64 h-auto",
}: CarritoVacioIlustracionProps) {
  return (
    <svg
      viewBox="0 0 220 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="carrito-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient
          id="carrito-manija"
          gradientUnits="userSpaceOnUse"
          x1="168"
          y1="24"
          x2="201"
          y2="24"
        >
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="181" rx="78" ry="9" fill="#f1f5f9" />

      {/* Manija */}
      <path
        d="M154 61 L168 24 H201"
        fill="none"
        stroke="url(#carrito-metal)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M168 24 H201"
        fill="none"
        stroke="url(#carrito-manija)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Base del carrito */}
      <path
        d="M145 128 L158 158 H49 L61 135"
        fill="none"
        stroke="url(#carrito-metal)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Canasto */}
      <path
        d="M35 62 H157 L145 128 H61 Z"
        fill="#f8fafc"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Alambres horizontales del canasto */}
      <path
        d="M41 78 H154 M48 94 H151 M54 110 H148"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Alambres verticales del canasto */}
      <path
        d="M48 62 L70 128 M64 62 L81 128 M80 62 L92 128 M96 62 L103 128 M112 62 L114 128 M128 62 L125 128 M144 62 L136 128"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Borde superior del canasto */}
      <path
        d="M33 62 H159"
        fill="none"
        stroke="url(#carrito-metal)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Ruedas */}
      <path
        d="M52 158 L52 168 H74 M148 158 L148 168 H126"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="63" cy="170" r="12" fill="#374151" />
      <circle cx="63" cy="170" r="4.5" fill="#cbd5e1" />
      <circle cx="137" cy="170" r="12" fill="#374151" />
      <circle cx="137" cy="170" r="4.5" fill="#cbd5e1" />
    </svg>
  );
}

export function CarritoVacioEstado() {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <CarritoVacioIlustracion />

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
