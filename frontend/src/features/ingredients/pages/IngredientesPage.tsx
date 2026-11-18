import { useState } from "react";
import IngredienteList from "../components/IngredienteList";
import { IngredienteModal } from "../components/IngredienteModal";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";
import { useIngredients } from "../hooks/useIngredients";

// Página principal del listado y gestión de Ingredientes
export default function IngredientesPage() {
  const {
    ingredientes,
    isPending,
    isError,
    crearIngrediente,
    editarIngrediente,
    eliminarIngrediente,
  } = useIngredients();

  // Estados locales para controlar el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ingredienteEditar, setIngredienteEditar] = useState<Ingrediente | null>(null);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  // Abre el modal para crear un ingrediente nuevo
  const handleCreate = () => {
    setErrorModal(null);
    setIngredienteEditar(null);
    setModalAbierto(true);
  };

  // Abre el modal precargado para editar
  const handleUpdate = (ingredienteSeleccionado: Ingrediente) => {
    setErrorModal(null);
    setIngredienteEditar(ingredienteSeleccionado);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setErrorModal(null);
    setModalAbierto(false);
  };

  const handleGuardar = async (ingredienteFormulario: IngredienteFormData) => {
    setErrorModal(null);
    try {
      if (ingredienteEditar) {
        await editarIngrediente({
          ...ingredienteFormulario,
          id: ingredienteEditar.id,
        });
      } else {
        await crearIngrediente(ingredienteFormulario);
      }
      handleCerrarModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorModal(err.message);
      }
    }
  };

  const handleDelete = (ingredienteId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este ingrediente?")) {
      eliminarIngrediente(ingredienteId);
    }
  };

  if (isPending) return <LoadingState mensaje="Cargando ingredientes..." />;
  if (isError) return <ErrorState mensaje="Error al cargar los ingredientes" />;

  return (
    <main className="w-full max-w-4xl mx-auto px-4 my-5">
      <IngredienteList
        ingredientes={ingredientes}
        onAñadirIngrediente={handleCreate}
        onEditar={handleUpdate}
        onEliminar={handleDelete}
      />

      {modalAbierto && (
        <IngredienteModal
          key={ingredienteEditar ? ingredienteEditar.id : "nuevo"}
          cerrarModal={handleCerrarModal}
          onSubmit={handleGuardar}
          ingredienteParaEditar={ingredienteEditar}
          error={errorModal}
        />
      )}
    </main>
  );
}
