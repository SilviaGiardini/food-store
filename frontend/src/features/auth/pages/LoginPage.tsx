// Pantalla de login: formulario y mensajes de error.
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "../hooks/useAuth";
import { useNotificationStore } from "@/store/notificationStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const { login, procesandoLogin, error, limpiarError, usuario } = useAuth();

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/categories";

  useEffect(() => {
    if (usuario) {
      navigate(from, { replace: true });
    }
  }, [usuario, navigate, from]);

  useEffect(() => {
    limpiarError();
  }, [limpiarError]);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.username.trim()) {
          return { fields: { username: "El usuario es obligatorio" } };
        }
        if (!value.password) {
          return { fields: { password: "La contraseña es obligatoria" } };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value.username.trim(), value.password);
        showNotification("Inicio de sesión exitoso", "success");
        navigate(from, { replace: true });
      } catch {
        // El error ya queda guardado en el authStore.
      }
    },
  });

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ingresá tus credenciales para acceder al sistema
          </p>
        </div>

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
            name="username"
            validators={{
              onBlur: ({ value }) =>
                !value.trim() ? "El usuario es obligatorio" : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  className={inputClass}
                  placeholder="admin"
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

          <button
            type="submit"
            disabled={procesandoLogin}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {procesandoLogin ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tenés una cuenta?{" "}
          <Link
            to="/register"
            className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
          >
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
}
