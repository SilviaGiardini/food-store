import { useState } from "react";
import CategoriaList from "../components/CategoriaList";
import { CategoriaModal } from "../components/CategoriaModal";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import type { Categoria } from "../types/categoria";
import { useCategories } from "../hooks/useCategories";

// Página principal del listado y gestión de Categorías
export default function CategoriesPage() {
  const {
    categorias,
    isPending,
    isError,
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
  } = useCategories();

  // Estados locales para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Categoria | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  // Abre el modal limpio para crear una nueva categoría
  const handleCreate = () => {
    setErrorModal(null);
    setCategoriaEditar(null);
    setModalAbierto(true);
  };

  // Abre el modal precargado con los datos para editar
  const handleUpdate = (categoriaSeleccionada: Categoria) => {
    setErrorModal(null);
    setCategoriaEditar(categoriaSeleccionada);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setErrorModal(null);
    setModalAbierto(false);
  };

  const handleGuardar = async (categoriaFormulario: {
    nombre: string;
    descripcion: string;
  }) => {
    setErrorModal(null);
    try {
      if (categoriaEditar) {
        await editarCategoria({ ...categoriaEditar, ...categoriaFormulario });
      } else {
        await crearCategoria(categoriaFormulario);
      }
      handleCerrarModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorModal(err.message);
      }
    }
  };

  const handleDelete = (categoriaId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      eliminarCategoria(categoriaId);
    }
  };

  if (isPending) return <LoadingState mensaje="Cargando categorías..." />;
  if (isError) return <ErrorState mensaje="Error al cargar las categorías" />;

  return (
    <main className="w-full max-w-4xl mx-auto px-4 my-5">
      <CategoriaList
        categorias={categorias}
        onAñadirCategoria={handleCreate}
        onEditar={handleUpdate}
        onEliminar={handleDelete}
      />
      {modalAbierto && (
        <CategoriaModal
          key={categoriaEditar ? categoriaEditar.id : "nueva"}
          cerrarModal={handleCerrarModal}
          onSubmit={handleGuardar}
          categoriaParaEditar={categoriaEditar}
          error={errorModal}
        />
      )}
    </main>
  );
}
