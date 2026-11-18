// Barrel export: API pública del módulo de autenticación e identidad
export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { useAuth } from "./hooks/useAuth";
export { useRegister } from "./hooks/useRegister";
export type * from "./types/auth.types";
