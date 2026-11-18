// Tabla de usuarios con TanStack Table y activar/desactivar.
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

import { EmptyState } from "@/shared/components/EmptyState";
import type { UsuarioAdmin } from "../types/auth.types";

interface UsuarioTableProps {
  usuarios: UsuarioAdmin[];
  onToggleEstado: (id: number, estaActivo: boolean) => void;
  procesandoId: number | null;
  usuarioActualId: number | null;
}

const columnHelper = createColumnHelper<UsuarioAdmin>();

const sinUsuarios: UsuarioAdmin[] = [];

export function UsuarioTable({
  usuarios,
  onToggleEstado,
  procesandoId,
  usuarioActualId,
}: UsuarioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("username", {
        header: "USUARIO",
        cell: (info) => (
          <span className="font-medium text-gray-900">
            @{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("full_name", {
        header: "NOMBRE",
        cell: (info) => (
          <span className="text-gray-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "EMAIL",
        cell: (info) => (
          <span className="font-mono text-xs text-gray-600">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("role", {
        header: "ROL",
        cell: (info) => (
          <span className="px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 rounded-md border border-orange-200">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("disabled", {
        header: "ESTADO",
        cell: (info) => {
          const estaActivo = !info.getValue();
          return estaActivo ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Activo
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300">
              Desactivado
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "acciones",
        header: "ACCIONES",
        cell: ({ row }) => {
          const usuario = row.original;
          const estaActivo = !usuario.disabled;
          const enProceso = procesandoId === usuario.id;
          const esMiCuenta = usuarioActualId === usuario.id;

          // El admin no puede desactivarse a sí mismo.
          if (esMiCuenta) {
            return (
              <span className="text-xs text-gray-400">Tu cuenta</span>
            );
          }

          return (
            <button
              type="button"
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
          );
        },
      }),
    ],
    [onToggleEstado, procesandoId, usuarioActualId]
  );

  const table = useReactTable({
    data: usuarios.length ? usuarios : sinUsuarios,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {usuarios.length === 0 ? (
        <EmptyState mensaje="No hay usuarios registrados." />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] table-fixed border-collapse text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-4 py-3.5 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100 ${
                          header.id === "username"
                            ? "w-32 text-left"
                            : header.id === "full_name"
                              ? "w-44 text-left"
                              : header.id === "email"
                                ? "w-56 text-left"
                                : header.id === "role"
                                  ? "w-24 text-left"
                                  : header.id === "disabled"
                                    ? "w-28 text-left"
                                    : header.id === "acciones"
                                      ? "w-32 text-center"
                                      : "text-left"
                        }`}
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 cursor-pointer disabled:cursor-default ${
                              header.id === "acciones"
                                ? "w-full justify-center"
                                : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                            disabled={!header.column.getCanSort()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
                    className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3.5 text-sm text-gray-700 align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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

export default UsuarioTable;
