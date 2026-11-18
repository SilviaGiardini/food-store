// Formulario para crear o editar un producto desde el panel admin.
import { useForm } from "@tanstack/react-form";

import { Button, Input } from "@/shared/ui";
import type { Categoria } from "@/features/categorias";
import type { Producto, ProductoFormData } from "../types/producto";

interface ProductoModalProps {
  cerrarModal: () => void;
  onSubmit: (producto: ProductoFormData) => Promise<void> | void;
  productoParaEditar?: Producto | null;
  categoriasDisponibles: Categoria[];
  error?: string | null;
}

// Abre el formulario y precarga los datos si se está editando.
export function ProductoModal({
  cerrarModal,
  onSubmit,
  productoParaEditar,
  categoriasDisponibles,
  error,
}: ProductoModalProps) {
  const form = useForm({
    defaultValues: {
      nombre: productoParaEditar?.nombre ?? "",
      descripcion: productoParaEditar?.descripcion ?? "",
      precio_base: productoParaEditar?.precio_base ?? 0,
      categoria_id:
        productoParaEditar?.categoria_id ??
        categoriasDisponibles[0]?.id ??
        0,
      imagen_url: productoParaEditar?.imagen_url ?? "",
      stock: productoParaEditar?.stock ?? 0,
      disponible: productoParaEditar?.disponible ?? true,
    },
    validators: {
      onSubmit: ({ value }) => {
        if (value.nombre.trim().length < 3) {
          return {
            fields: {
              nombre: "El nombre debe tener al menos 3 caracteres",
            },
          };
        }
        if (value.precio_base < 0) {
          return {
            fields: { precio_base: "El precio no puede ser negativo" },
          };
        }
        if (value.categoria_id <= 0) {
          return {
            fields: { categoria_id: "Seleccioná una categoría" },
          };
        }
        if (value.stock < 0) {
          return {
            fields: { stock: "El stock no puede ser negativo" },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        categoria_id: Number(value.categoria_id),
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: Number(value.precio_base),
        imagen_url: value.imagen_url.trim(),
        stock: Number(value.stock),
        disponible: value.disponible,
      });
    },
  });

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-5">
          {productoParaEditar ? "Editar producto" : "Nuevo producto"}
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
              onBlur: ({ value }) =>
                value.trim().length < 3
                  ? "El nombre debe tener al menos 3 caracteres"
                  : undefined,
            }}
          >
            {(field) => (
              <Input
                id="nombre"
                label="Nombre del producto"
                placeholder="Ej: Pizza napolitana"
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
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows={2}
                  className={inputClass}
                  placeholder="Ingredientes o detalle del producto"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(evento.target.value)
                  }
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) =>
                  Number(value) < 0
                    ? "El precio no puede ser negativo"
                    : undefined,
              }}
            >
              {(field) => (
                <Input
                  id="precio_base"
                  type="number"
                  step="0.01"
                  min="0"
                  label="Precio base ($)"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(Number(evento.target.value))
                  }
                  error={
                    field.state.meta.errors[0]
                      ? String(field.state.meta.errors[0])
                      : null
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  Number(value) < 0
                    ? "El stock no puede ser negativo"
                    : undefined,
              }}
            >
              {(field) => (
                <Input
                  id="stock"
                  type="number"
                  step="1"
                  min="0"
                  label="Stock"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(Number(evento.target.value))
                  }
                  error={
                    field.state.meta.errors[0]
                      ? String(field.state.meta.errors[0])
                      : null
                  }
                />
              )}
            </form.Field>
          </div>

          <form.Field
            name="categoria_id"
            validators={{
              onChange: ({ value }) =>
                Number(value) <= 0 ? "Seleccioná una categoría" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="categoria_id"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Categoría
                </label>
                <select
                  id="categoria_id"
                  className={inputClass}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(Number(evento.target.value))
                  }
                >
                  <option value={0}>Seleccionar categoría</option>
                  {categoriasDisponibles.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
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

          <form.Field name="imagen_url">
            {(field) => (
              <Input
                id="imagen_url"
                type="url"
                label="URL de la imagen (opcional)"
                placeholder="https://ejemplo.com/producto.jpg"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(evento) => field.handleChange(evento.target.value)}
              />
            )}
          </form.Field>

          <form.Field name="disponible">
            {(field) => (
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="disponible"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(evento) =>
                    field.handleChange(evento.target.checked)
                  }
                  className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                />
                <label
                  htmlFor="disponible"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Producto disponible para la venta
                </label>
              </div>
            )}
          </form.Field>

          {categoriasDisponibles.length === 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              ⚠️ No hay categorías disponibles. Primero creá una categoría.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={cerrarModal}>
              Cancelar
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit || categoriasDisponibles.length === 0
                  }
                >
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

export default ProductoModal;
