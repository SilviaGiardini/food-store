import { useState } from "react";
import ProductoList from "../components/ProductoList";
import { ProductoModal } from "../components/ProductoModal";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import type { Producto, ProductoFormData } from "../types/producto";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "@/features/categorias";

// Página principal del listado y gestión de Productos
export default function ProductsPage() {
  const {
    productos,
    isPending,
    isError,
    crearProducto,
    editarProducto,
    eliminarProducto,
  } = useProducts();

  // Consultamos las categorías disponibles a través de su barrel export
  const { categorias } = useCategories();

  // Variables de estado locales para controlar la UI del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  // Abre el modal para crear un producto nuevo
  const handleCreate = () => {
    setErrorModal(null);
    setProductoEditar(null);
    setModalAbierto(true);
  };

  // Abre el modal precargado con el producto a modificar
  const handleUpdate = (productoSeleccionado: Producto) => {
    setErrorModal(null);
    setProductoEditar(productoSeleccionado);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setErrorModal(null);
    setModalAbierto(false);
  };

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
      if (err instanceof Error) {
        setErrorModal(err.message);
      }
    }
  };

  const handleDelete = (productoId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      eliminarProducto(productoId);
    }
  };

  if (isPending) return <LoadingState mensaje="Cargando productos..." />;
  if (isError) return <ErrorState mensaje="Error al cargar los productos" />;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 my-5">
      <ProductoList
        productos={productos}
        onAñadirProducto={handleCreate}
        onEditar={handleUpdate}
        onEliminar={handleDelete}
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
