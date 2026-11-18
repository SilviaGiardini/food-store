import { useForm } from "@tanstack/react-form";

import { Button, Input } from "@/shared/ui";
import type { Categoria } from "../types/categoria";

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
              <Input
                id="nombre"
                label="Nombre de la categoría"
                placeholder="Ej: Pizzas y Empanadas"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(evento) => field.handleChange(evento.target.value)}
                error={
                  field.state.meta.errors[0]
                    ? String(field.state.meta.errors[0])
                    : null
                }
              />
            )}
          </form.Field>

          <form.Field name="descripcion">
            {(field) => (
              <Input
                id="descripcion"
                label="Descripción de la categoría"
                placeholder="Ej: Pizzas caseras a la piedra y empanadas tradicionales"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(evento) => field.handleChange(evento.target.value)}
              />
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
