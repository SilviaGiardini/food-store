// Protege las rutas según la sesión y el rol.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { LoadingState } from "@/shared/components/LoadingState";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const cargando = useAuthStore((state) => state.cargando);
  const usuario = useAuthStore((state) => state.usuario);
  const hasRole = useAuthStore((state) => state.hasRole);

  if (cargando) {
    return <LoadingState mensaje="Verificando sesión..." />;
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
