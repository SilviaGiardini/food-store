import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, RegisterPage, AdminUsersPage } from "@/features/auth";
import { CategoriesPage } from "@/features/categorias";
import { ProductsPage } from "@/features/productos";
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage";
import { ProtectedRoute } from "./ProtectedRoute";

// Enrutador principal de la aplicación que organiza rutas públicas y protegidas con Outlet
export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas accesibles sin autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Rutas protegidas: requieren sesión iniciada */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/categories" replace />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Route>

      {/* Rutas protegidas exclusivas para el rol 'admin' */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>

      {/* Redirección por defecto ante rutas desconocidas */}
      <Route path="*" element={<Navigate to="/categories" replace />} />
    </Routes>
  );
}

export default AppRouter;

