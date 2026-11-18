// Tabla de productos con acciones de administrador.
import { useMemo, useState } from "react";
import type { Producto } from "../types/producto";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuthStore } from "@/store/authStore";
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

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

interface ProductoListProps {
  productos: Producto[];
  onAñadirProducto: () => void;
  onEditar: (producto: Producto) => void;
  onEliminar: (productoId: number) => void;
  onAjustarStock: (producto: Producto, nuevoStock: number) => void;
  onToggleDisponible: (producto: Producto) => void;
  productoActualizando: number | null;
}

const columnHelper = createColumnHelper<Producto>();

const sinProductos: Producto[] = [];

// Dibuja la tabla y muestra los controles de stock y disponibilidad.
export default function ProductoList({
  productos,
  onAñadirProducto,
  onEditar,
  onEliminar,
  onAjustarStock,
  onToggleDisponible,
  productoActualizando,
}: ProductoListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const usuario = useAuthStore((state) => state.usuario);
  const esAdmin = usuario?.role === "admin";

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
        cell: (info) => (
          <div>
            <p className="font-medium text-gray-800">{info.getValue()}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {info.row.original.descripcion ?? "Sin descripción"}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("categoria", {
        header: "CATEGORÍA",
        cell: (info) => (
          <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-200">
            {info.getValue().nombre}
          </span>
        ),
      }),
      columnHelper.accessor("precio_base", {
        header: "PRECIO",
        cell: (info) => (
          <span className="font-medium text-gray-800">
            {formatoPrecio.format(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("stock", {
        header: "STOCK",
        cell: (info) => {
          const producto = info.row.original;
          const actualizando = productoActualizando === producto.id;
          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onAjustarStock(producto, Math.max(0, info.getValue() - 1))
                }
                disabled={actualizando || info.getValue() <= 0}
                className="w-6 h-6 rounded border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Restar stock a ${producto.nombre}`}
              >
                −
              </button>
              <span className="w-7 text-center font-mono text-sm text-gray-800">
                {info.getValue()}
              </span>
              <button
                type="button"
                onClick={() => onAjustarStock(producto, info.getValue() + 1)}
                disabled={actualizando}
                className="w-6 h-6 rounded border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Sumar stock a ${producto.nombre}`}
              >
                +
              </button>
            </div>
          );
        },
      }),
      columnHelper.accessor("disponible", {
        header: "DISPONIBLE",
        cell: (info) => {
          const producto = info.row.original;
          const actualizando = productoActualizando === producto.id;
          return (
            <button
              type="button"
              onClick={() => onToggleDisponible(producto)}
              disabled={actualizando}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                info.getValue()
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
              title="Cambiar disponibilidad"
            >
              {info.getValue() ? "Sí" : "No"}
            </button>
          );
        },
      }),
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
    [
      onAjustarStock,
      onEditar,
      onEliminar,
      onToggleDisponible,
      productoActualizando,
      esAdmin,
    ]
  );

  const table = useReactTable({
    data: productos.length ? productos : sinProductos,
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
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg font-bold text-gray-800">
          Productos ({productos.length})
        </h2>
        {esAdmin && (
          <button
            className="w-full sm:w-auto bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700 transition-colors text-sm font-medium shadow-sm"
            type="button"
            onClick={() => onAñadirProducto()}
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {productos.length === 0 ? (
        <EmptyState mensaje="No hay productos registrados en el catálogo." />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] table-fixed border-collapse text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-4 py-3.5 bg-gray-50 text-xs font-semibold text-gray-400 border-b border-gray-100 ${
                          header.id === "id"
                            ? "w-14 text-center"
                            : header.id === "nombre"
                              ? "w-64 text-left"
                              : header.id === "categoria"
                                ? "w-32 text-left"
                                : header.id === "precio_base"
                                  ? "w-28 text-left"
                                  : header.id === "stock"
                                    ? "w-28 text-left"
                                    : header.id === "disponible"
                                      ? "w-24 text-left"
                                      : header.id === "acciones"
                                        ? "w-32 text-center"
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
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3.5 text-sm text-gray-700 align-top"
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
