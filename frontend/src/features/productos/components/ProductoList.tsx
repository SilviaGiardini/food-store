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

// Props que recibe este componente desde la página padre (ProductsPage)
interface ProductoListProps {
  productos: Producto[]; // Lista de productos que viene de la API
  onAñadirProducto: () => void; // Función para abrir el modal en modo "crear"
  onEditar: (producto: Producto) => void; // Función para abrir el modal con un producto a editar
  onEliminar: (productoId: number) => void; // Función para borrar un producto por su ID
}

// Creamos el helper de columnas tipado con nuestra interfaz Producto.
const columnHelper = createColumnHelper<Producto>();

// Constante fija por si la lista viene vacía o undefined
const sinProductos: Producto[] = [];

export default function ProductoList({
  productos,
  onAñadirProducto,
  onEditar,
  onEliminar,
}: ProductoListProps) {
  // Estado para saber por qué columna estamos ordenando y en qué dirección
  const [sorting, setSorting] = useState<SortingState>([]);

  // Estado para la paginación
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const usuario = useAuthStore((state) => state.usuario);
  const esAdmin = usuario?.role === "admin";

  // Definición de las columnas de la tabla
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
            <span>{valor}</span>
          ) : (
            <span className="text-gray-400 italic">Sin descripción</span>
          );
        },
      }),

      columnHelper.accessor("precio_base", {
        header: "PRECIO",
        cell: (info) => (
          <span className="font-medium text-gray-800">
            $
            {Number(info.getValue()).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      }),

      columnHelper.accessor("categorias", {
        header: "CATEGORÍAS",
        cell: (info) => {
          const listaCategorias = info.getValue();
          if (!listaCategorias || listaCategorias.length === 0) {
            return (
              <span className="text-gray-400 italic text-xs">
                Sin categoría
              </span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1">
              {listaCategorias.map((categoria) => (
                <span
                  key={categoria.id}
                  className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-md border border-orange-200"
                >
                  {categoria.nombre}
                </span>
              ))}
            </div>
          );
        },
      }),

      columnHelper.accessor("disponible", {
        header: "ESTADO",
        cell: (info) => {
          const disponible = info.getValue();
          return disponible ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              Inactivo
            </span>
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

  // Inicializamos la instancia de TanStack Table
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
    <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Encabezado: Título con contador total y botón para crear nuevo producto */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-lg font-bold text-gray-800">
          Productos ({productos.length})
        </h2>
        {/* Solo mostramos el botón de añadir si el usuario es administrador */}
        {esAdmin && (
          <button
            className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
            type="button"
            onClick={() => onAñadirProducto()}
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {/* Si no hay productos cargados mostramos un mensaje vacío */}
      {productos.length === 0 ? (
        <EmptyState mensaje="No hay productos registrados en el catálogo." />
      ) : (
        <>
          {/* Tabla responsive con scroll horizontal en pantallas chicas */}
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
                            ? "w-14 text-center"
                            : header.id === "nombre"
                              ? "w-44 text-left"
                              : header.id === "precio_base"
                                ? "w-24 text-left"
                                : header.id === "categorias"
                                  ? "w-36 text-left"
                                  : header.id === "disponible"
                                    ? "w-24 text-left"
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

          {/* Barra de navegación inferior para cambiar de página */}
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
