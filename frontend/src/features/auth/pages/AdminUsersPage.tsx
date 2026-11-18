import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAuth } from "../hooks/useAuth";
import { UsuarioTable } from "../components/UsuarioTable";

// Componente para que los administradores gestionen las cuentas de usuario
export default function AdminUsersPage() {
  const { usuario } = useAuth();
  const { usuarios, cargando, actualizando, error, procesandoId, toggleEstadoUsuario, recargar } =
    useAdminUsers();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      {/* Encabezado de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Administración de Usuarios
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualiza y gestiona las cuentas de los usuarios del sistema
          </p>
        </div>

        {/* Botón para recargar la lista */}
        <button
          onClick={recargar}
          disabled={actualizando || cargando}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {actualizando ? "🔄 Actualizando..." : "🔄 Actualizar"}
        </button>
      </div>

      {/* Manejo de estados de carga y error */}
      {cargando && <LoadingState mensaje="Cargando usuarios del sistema..." />}

      {error && !cargando && <ErrorState mensaje={error} />}

      {/* Tabla con el listado de usuarios */}
      {!cargando && !error && (
        <UsuarioTable
          usuarios={usuarios}
          onToggleEstado={toggleEstadoUsuario}
          procesandoId={procesandoId}
          usuarioActualId={usuario?.id ?? null}
        />
      )}
    </main>
  );
}
