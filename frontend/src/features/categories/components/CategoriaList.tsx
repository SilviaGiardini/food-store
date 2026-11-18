import { useMemo, useState } from "react";
import type { Categoria } from "../types/categoria";
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

interface CategoriaListProps {
  categorias: Categoria[];
  onAñadirCategoria: () => void;
  onEditar: (categoriaSeleccionada: Categoria) => void;
  onEliminar: (categoriaId: number) => void;
}

const columnHelper = createColumnHelper<Categoria>();

const sinCategorias: Categoria[] = [];

export default function CategoriaList({
  categorias,
  onAñadirCategoria,
  onEditar,
  onEliminar,
}: CategoriaListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const user = useAuthStore((state) => state.user);
  const esAdmin = Boolean(user?.roles?.includes("admin"));

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <div className="text-center font-mono">#{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("nombre", {
        header: "NOMBRE",
      }),
      columnHelper.accessor("descripcion", {
        header: "DESCRIPCIÓN",
        cell: (info) => {
          const valor = info.getValue();
          return valor ? (
            valor
          ) : (
            <span className="text-gray-400 italic">Sin descripción</span>
          );
        },
      }),

      // Solo los administradores pueden ver y usar la columna de acciones (editar/eliminar)
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
    [onEditar, onEliminar, esAdmin]
  );

  const table = useReactTable({
    data: categorias.length ? categorias : sinCategorias,
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
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg font-bold text-gray-800">
          Categorías ({categorias.length})
        </h2>
        {/* Solo mostramos el botón de añadir si el usuario es administrador */}
        {esAdmin && (
          <button
            className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
            type="button"
            onClick={() => onAñadirCategoria()}
          >
            + Nueva categoría
          </button>
        )}
      </div>

      {categorias.length === 0 ? (
        <EmptyState mensaje="No hay categorías registradas en el catálogo." />
      ) : (
        <>
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
                            ? "w-16 text-center"
                            : header.id === "nombre"
                              ? "w-48 text-left"
                              : header.id === "acciones"
                                ? "w-36 text-center"
                                : "text-left"
                        }`}
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 cursor-pointer disabled:cursor-default ${
                              header.id === "id" || header.id === "acciones"
                                ? "w-full justify-center"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                            disabled={!header.column.getCanSort()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
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
