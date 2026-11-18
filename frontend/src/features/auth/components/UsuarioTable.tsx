// Tabla de usuarios con activar/desactivar.
import type { UsuarioAdmin } from "../types/auth.types";

interface UsuarioTableProps {
  usuarios: UsuarioAdmin[];
  onToggleEstado: (id: number, estaActivo: boolean) => void;
  procesandoId: number | null;
}

export function UsuarioTable({
  usuarios,
  onToggleEstado,
  procesandoId,
}: UsuarioTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <tr>
              <th className="py-3.5 px-4">Usuario</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Rol</th>
              <th className="py-3.5 px-4 text-center">Estado</th>
              <th className="py-3.5 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => {
                const estaActivo = !usuario.disabled;
                const enProceso = procesandoId === usuario.id;

                return (
                  <tr key={usuario.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {usuario.full_name}
                      <span className="block text-xs font-normal text-gray-400">
                        @{usuario.username}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">
                      {usuario.email}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 rounded-md border border-orange-200">
                        {usuario.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {estaActivo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300">
                          Desactivado
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onToggleEstado(usuario.id, estaActivo)}
                        disabled={enProceso}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                          estaActivo
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {enProceso
                          ? "Procesando..."
                          : estaActivo
                          ? "Desactivar"
                          : "Activar"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuarioTable;
