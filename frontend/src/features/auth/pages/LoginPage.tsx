import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "../hooks/useAuth";
import { useNotificationStore } from "@/store/notificationStore";

// Componente de página para inicio de sesión
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const { login, procesandoLogin, error, limpiarError, user } = useAuth();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/categories";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Limpiamos los mensajes de error al montar el componente
  useEffect(() => {
    limpiarError();
  }, [limpiarError]);

  // Configuramos el formulario con TanStack Form
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.email.trim()) {
          return { fields: { email: "El email es obligatorio" } };
        }
        if (!value.password) {
          return { fields: { password: "La contraseña es obligatoria" } };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        // Intentamos iniciar sesión con los datos ingresados
        await login(value.email.trim(), value.password);
        showNotification("Inicio de sesión exitoso", "success");
        navigate(from, { replace: true });
      } catch {
        // El error ya es capturado y seteado en el hook useAuth
      }
    },
  });

  // Clase común para los inputs de Tailwind
  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        {/* Encabezado del formulario */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {/* Mensaje de error si falla la autenticación */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario de login */}
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
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
                  placeholder="usuario@ejemplo.com"
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

          {/* Campo de Contraseña */}
          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) =>
                !value ? "La contraseña es obligatoria" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Contraseña
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

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={procesandoLogin}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {procesandoLogin ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        {/* Enlace para registrarse */}
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
