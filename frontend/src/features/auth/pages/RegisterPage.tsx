import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useRegister } from "../hooks/useRegister";

// Componente de página para registrar una nueva cuenta de usuario
export default function RegisterPage() {
  const navigate = useNavigate();
  const { registrar, cargando, error } = useRegister();

  // Formulario gestionado con TanStack Form
  const form = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.nombre.trim()) {
          return { fields: { nombre: "El nombre es obligatorio" } };
        }
        if (!value.apellido.trim()) {
          return { fields: { apellido: "El apellido es obligatorio" } };
        }
        if (!value.email.trim()) {
          return { fields: { email: "El email es obligatorio" } };
        }
        if (!value.password) {
          return { fields: { password: "La contraseña es obligatoria" } };
        }
        if (value.password.length < 8) {
          return {
            fields: {
              password: "La contraseña debe tener al menos 8 caracteres",
            },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const ok = await registrar({
        nombre: value.nombre,
        apellido: value.apellido,
        email: value.email,
        celular: value.celular,
        password: value.password,
      });

      if (ok) {
        navigate("/login");
      }
    },
  });

  // Estilo visual estándar para los inputs
  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">
        {/* Título de la página */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear Cuenta</h2>
          <p className="text-sm text-gray-500 mt-1">
            Completa tus datos para registrarte en la plataforma
          </p>
        </div>

        {/* Mensaje de error si falla la creación */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario de registro */}
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Fila con Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="nombre"
              validators={{
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
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className={inputClass}
                    placeholder="Ana"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(evento) => field.handleChange(evento.target.value)}
                  />
                  {field.state.meta.errors.map((errorValidacion) => (
                    <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                      {String(errorValidacion)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field
              name="apellido"
              validators={{
                onBlur: ({ value }) =>
                  !value.trim() ? "El apellido es obligatorio" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label
                    htmlFor="apellido"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    type="text"
                    className={inputClass}
                    placeholder="Pérez"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(evento) => field.handleChange(evento.target.value)}
                  />
                  {field.state.meta.errors.map((errorValidacion) => (
                    <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                      {String(errorValidacion)}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          {/* Campo de Correo Electrónico */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value.trim()) return undefined;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value)
                  ? "Formato de email inválido"
                  : undefined;
              },
              onBlur: ({ value }) =>
                !value.trim() ? "El email es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClass}
                  placeholder="ana@ejemplo.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
                {field.state.meta.errors.map((errorValidacion) => (
                  <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Campo Celular (Opcional) */}
          <form.Field name="celular">
            {(field) => (
              <div>
                <label
                  htmlFor="celular"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Celular <span className="text-gray-400 font-normal">(Opcional)</span>
                </label>
                <input
                  id="celular"
                  type="tel"
                  className={inputClass}
                  placeholder="+54 9 11 1234-5678"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
              </div>
            )}
          </form.Field>

          {/* Campo Contraseña */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                value.length > 0 && value.length < 8
                  ? "La contraseña debe tener al menos 8 caracteres"
                  : undefined,
              onBlur: ({ value }) =>
                !value
                  ? "La contraseña es obligatoria"
                  : value.length < 8
                  ? "La contraseña debe tener al menos 8 caracteres"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Contraseña (mínimo 8 caracteres)
                </label>
                <input
                  id="password"
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) => field.handleChange(evento.target.value)}
                />
                {field.state.meta.errors.map((errorValidacion) => (
                  <p key={String(errorValidacion)} className="mt-1 text-xs text-red-500">
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Botón para enviar el registro */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {cargando ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        {/* Enlace para volver al login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
