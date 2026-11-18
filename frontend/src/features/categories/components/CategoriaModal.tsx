import type { Categoria } from "../types/categoria";
import { useForm } from "@tanstack/react-form";

interface CategoriaModalProps {
  cerrarModal: () => void;
  onSubmit: (categoria: { nombre: string; descripcion: string }) => void;
  categoriaParaEditar?: Categoria | null;
  error?: string | null;
}

export function CategoriaModal({
  cerrarModal,
  onSubmit,
  categoriaParaEditar,
  error,
}: CategoriaModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: categoriaParaEditar?.nombre ?? "",
      descripcion: categoriaParaEditar?.descripcion ?? "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.nombre.trim()) {
          return { fields: { nombre: "El nombre es obligatorio" } };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
      });
    },
  });

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-6 mb-8 w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-1.5">
          <span className="text-gray-500 font-normal">+</span>
          {categoriaParaEditar ? "Editar Categoría" : "Nueva Categoría"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
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
                  Nombre de la categoría
                </label>
                <input
                  id="nombre"
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Pizzas y Empanadas"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
                {field.state.meta.errors.map((errorValidacion) => (
                  <p
                    key={String(errorValidacion)}
                    className="mt-1 text-xs text-red-500"
                  >
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Descripción de la categoría
                </label>
                <input
                  id="descripcion"
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Pizzas caseras a la piedra y empanadas tradicionales"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>

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
