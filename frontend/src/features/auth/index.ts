// Barrel export: API pública del módulo de autenticación e identidad
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { default as AdminUsersPage } from "./pages/AdminUsersPage";
export { useAuth } from "./hooks/useAuth";
export { useRegister } from "./hooks/useRegister";
export { useAdminUsers } from "./hooks/useAdminUsers";
export type * from "./types/auth.types";
