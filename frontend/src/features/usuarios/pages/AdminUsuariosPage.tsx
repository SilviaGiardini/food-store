import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useAuth } from "@/features/auth";
import { useUsuarios } from "../hooks/useUsuarios";
import { UsuarioTable } from "../components/UsuarioTable";

// Panel de cuentas: el admin puede activar o desactivar usuarios.
export default function AdminUsuariosPage() {
  const { usuario } = useAuth();
  const { usuarios, cargando, actualizando, error, procesandoId, toggleEstadoUsuario, recargar } =
    useUsuarios();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      {/* Encabezado de la página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Administración de Usuarios
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Desde acá podés ver y gestionar las cuentas del sistema.
          </p>
        </div>

        {/* Refresca la tabla sin recargar la página */}
        <button
          onClick={recargar}
          disabled={actualizando || cargando}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {actualizando ? "🔄 Actualizando..." : "🔄 Actualizar"}
        </button>
      </div>

      {/* Mientras carga o si falla, mostramos el estado correspondiente */}
      {cargando && <LoadingState mensaje="Cargando usuarios del sistema..." />}

      {error && !cargando && <ErrorState mensaje={error} />}

      {/* El id del admin evita mostrarle el botón de su propia cuenta */}
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
