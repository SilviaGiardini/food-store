// Tipo de usuario que se muestra en la administración.
export interface UsuarioAdmin {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  disabled: boolean;
  created_at: string;
}
