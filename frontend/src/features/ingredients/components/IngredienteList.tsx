import { useMemo, useState } from "react";
import type { Ingrediente } from "../types/ingrediente";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuthStore } from "@/features/auth";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

// Props que recibe la tabla desde IngredientesPage
interface IngredienteListProps {
  ingredientes: Ingrediente[]; // Array con los ingredientes traídos de la API
  onAñadirIngrediente: () => void; // Función para abrir el modal limpio
  onEditar: (ingrediente: Ingrediente) => void; // Función para abrir el modal con el ingrediente a modificar
  onEliminar: (ingredienteId: number) => void; // Función para borrar el ingrediente
}

// Helper tipado de TanStack Table para definir columnas de Ingrediente
const columnHelper = createColumnHelper<Ingrediente>();

// Array vacío para evitar recrear referencias si la lista está vacía
const sinIngredientes: Ingrediente[] = [];

export default function IngredienteList({
  ingredientes,
  onAñadirIngrediente,
  onEditar,
  onEliminar,
}: IngredienteListProps) {
  const user = useAuthStore((state) => state.user);
  const esAdmin = user?.roles?.includes("admin");

  // Estado para el ordenamiento (columna activa y dirección asc/desc)
  const [sorting, setSorting] = useState<SortingState>([]);

  // Estado para la paginación (página actual y cantidad por página)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => `#${info.getValue()}`,
      }),

      columnHelper.accessor("nombre", {
        header: "NOMBRE",
        cell: (info) => (
          <span className="font-semibold text-gray-900">{info.getValue()}</span>
        ),
      }),

      // Columna de acciones: solo visible y utilizable por administradores
      ...(esAdmin
        ? [
            columnHelper.display({
              id: "acciones",
              header: "ACCIONES",
              cell: ({ row }) => (
                <div className="flex justify-center items-center gap-3 text-xs">
                  <button
                    className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                    type="button"
                    onClick={() => onEditar(row.original)}
                  >
                    Editar
                  </button>
                  <button
                    className="font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                    type="button"
                    onClick={() => onEliminar(row.original.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ),
            }),
          ]
        : []),
    ],
    [onEditar, onEliminar, esAdmin],
  );

  // Inicializamos la tabla conectando datos, columnas y modelos de ordenamiento y paginación
  const table = useReactTable({
    data: ingredientes.length ? ingredientes : sinIngredientes,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Encabezado: Título con contador total y botón de añadir ingrediente */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg font-bold text-gray-800">
          Ingredientes ({ingredientes.length})
        </h2>
        {esAdmin && (
          <button
            className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
            type="button"
            onClick={() => onAñadirIngrediente()}
          >
            + Nuevo ingrediente
          </button>
        )}
      </div>

      {/* Si no hay ingredientes, mostramos un mensaje */}
      {ingredientes.length === 0 ? (
        <EmptyState mensaje="No hay ingredientes registrados en el catálogo." />
      ) : (
        <>
          {/* Tabla de ingredientes */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-5 py-3.5 bg-gray-50 text-xs font-semibold text-gray-400 border-b border-gray-100 ${
                          header.id === "id"
                            ? "w-20 text-left"
                            : header.id === "acciones"
                              ? "w-36 text-center"
                              : "text-left"
                        }`}
                      >
                        {header.isPlaceholder ? null : (
                          // Botón para ordenar al hacer clic en el encabezado
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 cursor-pointer disabled:cursor-default ${
                              header.id === "acciones" ? "w-full justify-center" : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                            disabled={!header.column.getCanSort()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {/* Indicador de ordenamiento ▲ o ▼ */}
                            {header.column.getIsSorted()
                              ? { asc: " ▲", desc: " ▼" }[
                                  header.column.getIsSorted() as string
                                ]
                              : null}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {/* Filas correspondientes a la página actual */}
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-5 py-3.5 text-sm text-gray-700 align-top"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navegación y controles de paginación */}
          <nav className="flex items-center justify-center gap-4 border-t border-gray-100 bg-gray-50 px-4 py-3">
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </button>
            <span className="text-xs text-gray-500">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 bg-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-45"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
