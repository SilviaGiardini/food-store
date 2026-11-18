import type { Producto, ProductoFormData } from "../types/producto";
import type { Categoria } from "@/features/categories";
import { useForm } from "@tanstack/react-form";

interface ProductoModalProps {
  cerrarModal: () => void;
  onSubmit: (producto: ProductoFormData) => void;
  productoParaEditar?: Producto | null;
  categoriasDisponibles: Categoria[];
  error?: string | null;
}

export function ProductoModal({
  cerrarModal,
  onSubmit,
  productoParaEditar,
  categoriasDisponibles,
  error,
}: ProductoModalProps) {
  // Calculamos las categorías iniciales:
  // - Si estamos editando, usamos los IDs de las categorías que ya tenía el producto.
  // - Si es un producto nuevo, preseleccionamos la primera categoría disponible para facilitar la carga.
  const defaultCategoriaIds = productoParaEditar?.categorias?.map((categoria) => categoria.id) ?? (
    categoriasDisponibles.length > 0 ? [categoriasDisponibles[0].id] : []
  );

  // Inicializamos el formulario con useForm de TanStack Form
  const form = useForm({
    // Valores iniciales de cada campo
    defaultValues: {
      nombre: productoParaEditar?.nombre ?? "",
      descripcion: productoParaEditar?.descripcion ?? "",
      precio_base: productoParaEditar?.precio_base ?? 0,
      disponible: productoParaEditar?.disponible ?? true,
      categoria_ids: defaultCategoriaIds,
    },

    // Validadores a nivel formulario que se evalúan al intentar enviar (submit)
    validators: {
      onSubmit: ({ value }) => {
        if (!value.nombre.trim()) {
          return { fields: { nombre: "El nombre es obligatorio" } };
        }
        if (value.precio_base < 0) {
          return { fields: { precio_base: "El precio no puede ser negativo" } };
        }
        if (!value.categoria_ids || value.categoria_ids.length === 0) {
          return {
            fields: { categoria_ids: "Debes seleccionar al menos una categoría" },
          };
        }
        return undefined; // Retornar undefined significa que todo está OK
      },
    },

    // Función que se ejecuta si todas las validaciones pasaron correctamente
    onSubmit: async ({ value }) => {
      onSubmit({
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: Number(value.precio_base),
        disponible: value.disponible,
        categoria_ids: value.categoria_ids,
        imagenes_url: productoParaEditar?.imagenes_url ?? [],
      });
    },
  });

  // Clases comunes de Tailwind para los inputs de texto
  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      {/* Tarjeta del modal */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-6 mb-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Título dinámico: cambia según si creamos o editamos */}
        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-1.5">
          <span className="text-gray-500 font-normal">+</span>
          {productoParaEditar ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        {/* Mensaje de alerta si el backend devolvió un error (ej: nombre duplicado) */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario conectado al handleSubmit de TanStack Form */}
        <form
          onSubmit={(evento) => {
            evento.preventDefault(); // Evitamos que recargue la página
            form.handleSubmit(); // Dispara las validaciones y el guardado
          }}
          className="space-y-4"
        >
   
          {/* CAMPO: Nombre del Producto */}
      
          <form.Field
            name="nombre"
            validators={{
              // Validación mientras el usuario escribe
              onChange: ({ value }) =>
                value.trim().length > 0 && value.trim().length < 3
                  ? "El nombre debe tener al menos 3 caracteres"
                  : undefined,
              // Validación cuando el usuario sale del input (desenfoca)
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
                  Nombre del producto
                </label>
                <input
                  id="nombre"
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Pizza Napolitana Especial"
                  value={field.state.value} // Conectamos el valor del estado interno
                  onBlur={field.handleBlur} // Avisa a TanStack Form que se salió del campo
                  onChange={(evento) => field.handleChange(evento.target.value)} // Actualiza el valor
                />
                {/* Mostramos los errores del campo si existen */}
                {field.state.meta.errors.map((errorValidacion) => (
                  <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
          {/* CAMPO: Descripción (opcional)                             */}
          <form.Field name="descripcion">
            {(field) => (
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Descripción del producto
                </label>
                <textarea
                  id="descripcion"
                  rows={2}
                  className={inputClass}
                  placeholder="Ej: Masa artesanal con salsa de tomate pomodoro, mozzarella y albahaca fresca"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
              </div>
            )}
          </form.Field>
          {/* CAMPO: Precio Base (numérico, no puede ser negativo)      */}
          <form.Field
            name="precio_base"
            validators={{
              onChange: ({ value }) =>
                Number(value) < 0
                  ? "El precio no puede ser negativo"
                  : undefined,
              onBlur: ({ value }) =>
                isNaN(Number(value)) || Number(value) < 0
                  ? "Ingresa un precio válido mayor o igual a 0"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="precio_base"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Precio base ($)
                </label>
                <input
                  id="precio_base"
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputClass}
                  placeholder="0.00"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(Number(evento.target.value))}
                />
                {/* Error de precio */}
                {field.state.meta.errors.map((errorValidacion) => (
                  <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* CAMPO: Categorías */}

          <form.Field
            name="categoria_ids"
            validators={{
              onChange: ({ value }) =>
                !value || value.length === 0
                  ? "Selecciona al menos una categoría"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Categorías asociadas
                </label>
                {categoriasDisponibles.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ No hay categorías disponibles. Primero crea al menos una categoría.
                  </p>
                ) : (
                  // Lista de botones interactivos para marcar/desmarcar categorías
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {categoriasDisponibles.map((cat) => {
                      // Verificamos si este ID ya está dentro del array de categorías seleccionadas
                      const isSelected = field.state.value.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            const current = field.state.value;
                            if (isSelected) {
                              // Si ya estaba seleccionada, la sacamos del array
                              field.handleChange(
                                current.filter((id: number) => id !== cat.id),
                              );
                            } else {
                              // Si no estaba, la agregamos al array
                              field.handleChange([...current, cat.id]);
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-all border ${
                            isSelected
                              ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {cat.nombre}
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* Error si no seleccionó ninguna categoría */}
                {field.state.meta.errors.map((err) => (
                  <p key={String(err)} className="mt-1 text-xs text-red-500">
                    {String(err)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* CAMPO: Disponible */}
          <form.Field name="disponible">
            {(field) => (
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="disponible"
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(evento) => field.handleChange(evento.target.checked)}
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

          {/* BOTONES DE ACCIÓN: Cancelar y Guardar                     */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {/* form.Subscribe se suscribe solo al estado canSubmit e isSubmitting del form */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  // Se deshabilita si hay errores en el form o si no hay categorías disponibles
                  disabled={!canSubmit || categoriasDisponibles.length === 0}
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
