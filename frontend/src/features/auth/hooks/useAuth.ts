import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const procesandoLogin = useAuthStore((state) => state.procesandoLogin);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const hasRole = useAuthStore((state) => state.hasRole);
  const limpiarError = useAuthStore((state) => state.limpiarError);

  return {
    user,
    status,
    procesandoLogin,
    error,
    login,
    logout,
    checkAuth,
    hasRole,
    limpiarError,
  };
}

export default useAuth;
