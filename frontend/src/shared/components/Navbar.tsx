// Barra de navegación: sesión, rol y accesos.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useCartStore } from "@/store/cartStore";

export function Navbar() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const items = useCartStore((state) => state.items);
  const cantidadCarrito = items.reduce(
    (suma, item) => suma + item.cantidad,
    0
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const esAdmin = usuario?.role === "admin";

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            🍔 Food Store
          </Link>

          {usuario && (
            <nav>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mis-pedidos"
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    Mis pedidos
                  </Link>
                </li>
                {esAdmin && (
                  <li>
                    <Link
                      to="/admin/resumen"
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      Resumen
                    </Link>
                  </li>
                )}
                {esAdmin && (
                  <li>
                    <Link
                      to="/admin/categorias"
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      Categorías
                    </Link>
                  </li>
                )}
                {esAdmin && (
                  <li>
                    <Link
                      to="/admin/pedidos"
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      Pedidos
                    </Link>
                  </li>
                )}
                {esAdmin && (
                  <li>
                    <Link
                      to="/admin/productos"
                      className="text-gray-600 hover:text-orange-600 transition-colors"
                    >
                      Productos
                    </Link>
                  </li>
                )}
                {esAdmin && (
                  <li>
                    <Link
                      to="/admin/usuarios"
                      className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      Usuarios
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/carrito"
            className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
          >
            Carrito ({cantidadCarrito})
          </Link>

          {usuario ? (
            <div className="flex items-center gap-3 text-sm">
              <div className="text-right">
                <span className="font-semibold text-gray-800 block">
                  {usuario.full_name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-medium">
                  {usuario.role}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
