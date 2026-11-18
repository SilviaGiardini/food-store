import { Link } from "react-router-dom";

// Página que se muestra cuando el usuario no tiene permisos.
export function UnauthorizedPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🚫
        </div>

        <span className="text-xs font-semibold tracking-wider text-red-600 uppercase bg-red-50 px-3 py-1 rounded-full">
          Error 403 • Prohibido
        </span>

        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          Acceso Denegado
        </h1>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          No cuentas con los permisos necesarios para acceder a este recurso o realizar esta acción en el sistema.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
