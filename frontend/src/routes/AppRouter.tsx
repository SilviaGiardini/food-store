// Mapa de rutas de la aplicación.
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, RegisterPage, AdminUsersPage } from "@/features/auth";
import { CategoriesPage } from "@/features/categorias";
import { CatalogoPage } from "@/features/productos";
import {
  AdminPedidosPage,
  AdminResumenPage,
  CarritoPage,
  CheckoutPage,
  MisPedidosPage,
} from "@/features/pedidos";
import { UnauthorizedPage } from "@/shared/components/UnauthorizedPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CatalogoPage />} />
      <Route path="/carrito" element={<CarritoPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/mis-pedidos" element={<MisPedidosPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/resumen" element={<AdminResumenPage />} />
        <Route path="/admin/categorias" element={<CategoriesPage />} />
        <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
        <Route path="/admin/usuarios" element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
