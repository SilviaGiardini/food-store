// Paginación con botones de anterior y siguiente.
interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) {
  return (
    <nav className="flex items-center justify-center gap-4 mt-8">
      <button
        type="button"
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual <= 0}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      <span className="text-sm text-gray-500">
        Página {paginaActual + 1} de {Math.max(1, totalPaginas)}
      </span>

      <button
        type="button"
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas - 1}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </nav>
  );
}

export default Paginacion;
