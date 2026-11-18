// Expone el estado de sesión a los componentes.
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const usuario = useAuthStore((state) => state.usuario);
  const cargando = useAuthStore((state) => state.cargando);
  const procesandoLogin = useAuthStore((state) => state.procesandoLogin);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const checkSession = useAuthStore((state) => state.checkSession);
  const hasRole = useAuthStore((state) => state.hasRole);
  const limpiarError = useAuthStore((state) => state.limpiarError);

  return {
    usuario,
    cargando,
    procesandoLogin,
    error,
    login,
    logout,
    checkSession,
    hasRole,
    limpiarError,
  };
}

export default useAuth;
