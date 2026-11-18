// Componente de formulario para crear y editar ingredientes

import type { Ingrediente, IngredienteFormData } from "../types/ingrediente";
import { useForm } from "@tanstack/react-form";

interface IngredienteModalProps {
  cerrarModal: () => void;
  onSubmit: (ingrediente: IngredienteFormData) => void;
  ingredienteParaEditar?: Ingrediente | null;
  error?: string | null;
}

export function IngredienteModal({
  cerrarModal,
  onSubmit,
  ingredienteParaEditar,
  error,
}: IngredienteModalProps) {
  // Inicializamos useForm de TanStack Form
  const form = useForm({
    // Valores iniciales: si estamos editando precargamos el nombre, sino queda vacío
    defaultValues: {
      nombre: ingredienteParaEditar?.nombre ?? "",
    },

    // Validación global al momento de hacer Submit
    validators: {
      onSubmit: ({ value }) => {
        if (!value.nombre.trim()) {
          return { fields: { nombre: "El nombre es obligatorio" } };
        }
        return undefined; 
      },
    },

    // Acción al enviar con éxito
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
      });
    },
  });

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      {/* Caja del modal */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-6 mb-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-1.5">
          <span className="text-gray-500 font-normal">+</span>
          {ingredienteParaEditar ? "Editar Ingrediente" : "Nuevo Ingrediente"}
        </h2>

        {/* Mensaje de error si el backend rechaza la operación (ej: nombre duplicado) */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Campo: Nombre del Ingrediente con validación en vivo */}
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                value.trim().length > 0 && value.trim().length < 3
                  ? "El nombre debe tener al menos 3 caracteres"
                  : undefined,
              onBlur: ({ value }) =>
                !value.trim() ? "El nombre es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Nombre del ingrediente
                </label>
                <input
                  id="nombre"
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Harina de Trigo 000"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
                {/* Mensajes de validación de error */}
                {field.state.meta.errors.map((errorValidacion) => (
                  <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {/* form.Subscribe escucha reactivamente si el form es válido para habilitar el botón */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
