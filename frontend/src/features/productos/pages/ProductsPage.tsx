// Página de administración de productos.
import { useState } from "react";

import { useCategories } from "@/features/categorias";
import { handleApiError } from "@/shared/api/handleApiError";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import ProductoList from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";
import { useProducts } from "../hooks/useProducts";
import type { Producto, ProductoFormData } from "../types/producto";

// Maneja el modal y conecta la tabla con las acciones del hook.
export default function ProductsPage() {
  const {
    productos,
    isPending,
    isError,
    crearProducto,
    editarProducto,
    eliminarProducto,
    actualizarStock,
    actualizandoId,
  } = useProducts();
  const { categorias } = useCategories();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const handleCreate = () => {
    setErrorModal(null);
    setProductoEditar(null);
    setModalAbierto(true);
  };

  const handleUpdate = (productoSeleccionado: Producto) => {
    setErrorModal(null);
    setProductoEditar(productoSeleccionado);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setErrorModal(null);
    setModalAbierto(false);
  };

  // Guarda el producto nuevo o los cambios del que se está editando.
  const handleGuardar = async (productoFormulario: ProductoFormData) => {
    setErrorModal(null);
    try {
      if (productoEditar) {
        await editarProducto({
          ...productoFormulario,
          id: productoEditar.id,
        });
      } else {
        await crearProducto(productoFormulario);
      }
      handleCerrarModal();
    } catch (err: unknown) {
      setErrorModal(handleApiError(err, "No se pudo guardar el producto"));
    }
  };

  const handleDelete = (productoId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      eliminarProducto(productoId);
    }
  };

  // Los botones + y − cambian solo el stock y conservan la disponibilidad.
  const handleAjustarStock = (producto: Producto, nuevoStock: number) => {
    actualizarStock({
      id: producto.id,
      stock: nuevoStock,
      disponible: producto.disponible,
    });
  };

  // El botón de disponibilidad conserva el stock que ya tiene el producto.
  const handleToggleDisponible = (producto: Producto) => {
    actualizarStock({
      id: producto.id,
      stock: producto.stock,
      disponible: !producto.disponible,
    });
  };

  if (isPending) return <LoadingState mensaje="Cargando productos..." />;
  if (isError) return <ErrorState mensaje="Error al cargar los productos" />;

  return (
    <main className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestioná el catálogo, el stock y la disponibilidad.
        </p>
      </div>

      <ProductoList
        productos={productos}
        onAñadirProducto={handleCreate}
        onEditar={handleUpdate}
        onEliminar={handleDelete}
        onAjustarStock={handleAjustarStock}
        onToggleDisponible={handleToggleDisponible}
        productoActualizando={actualizandoId}
      />

      {modalAbierto && (
        <ProductoModal
          key={productoEditar ? productoEditar.id : "nuevo"}
          cerrarModal={handleCerrarModal}
          onSubmit={handleGuardar}
          productoParaEditar={productoEditar}
          categoriasDisponibles={categorias}
          error={errorModal}
        />
      )}
    </main>
  );
}
