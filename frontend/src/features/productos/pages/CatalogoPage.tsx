// Página pública del catálogo con búsqueda, filtros y paginación.
import { useState } from "react";

import { useCategories } from "@/features/categorias";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Paginacion } from "@/shared/components/Paginacion";
import { Skeleton } from "@/shared/components/Skeleton";
import { ProductoCard } from "../components/ProductoCard";
import { useCatalogoProductos } from "../hooks/useCatalogoProductos";

const PRODUCTOS_POR_PAGINA = 9;

export default function CatalogoPage() {
  const [pagina, setPagina] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>();
  const [disponible, setDisponible] = useState<boolean | undefined>();

  const { categorias } = useCategories();
  const { productos, total, cargando, error } = useCatalogoProductos({
    skip: pagina * PRODUCTOS_POR_PAGINA,
    limit: PRODUCTOS_POR_PAGINA,
    search: busqueda,
    categoria_id: categoriaId,
    disponible,
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(total / PRODUCTOS_POR_PAGINA)
  );

  const handleBusqueda = (valor: string) => {
    setBusqueda(valor);
    setPagina(0);
  };

  const handleCategoria = (valor: string) => {
    setCategoriaId(valor ? Number(valor) : undefined);
    setPagina(0);
  };

  const handleDisponible = (valor: string) => {
    setDisponible(valor === "" ? undefined : valor === "true");
    setPagina(0);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Elegí tus productos y armá el pedido.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="busqueda"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Buscar
          </label>
          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(evento) => handleBusqueda(evento.target.value)}
            placeholder="Nombre del producto"
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Categoría
          </label>
          <select
            id="categoria"
            value={categoriaId ?? ""}
            onChange={(evento) => handleCategoria(evento.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="disponible"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Disponibilidad
          </label>
          <select
            id="disponible"
            value={disponible === undefined ? "" : String(disponible)}
            onChange={(evento) => handleDisponible(evento.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>
        </div>
      </div>

      {cargando && <Skeleton cantidad={PRODUCTOS_POR_PAGINA} />}

      {!cargando && error && (
        <ErrorState mensaje="No se pudo cargar el catálogo." />
      )}

      {!cargando && !error && productos.length === 0 && (
        <EmptyState mensaje="No hay productos que coincidan con los filtros." />
      )}

      {!cargando && !error && productos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {!cargando && !error && total > 0 && (
        <Paginacion
          paginaActual={pagina}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPagina}
        />
      )}
    </main>
  );
}
