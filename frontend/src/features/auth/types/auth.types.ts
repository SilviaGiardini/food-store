// Tipos de usuario que devuelve el backend.
export interface UsuarioAuth {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  disabled: boolean;
  created_at: string;
}

export interface RegistroUsuario {
  username: string;
  full_name: string;
  email: string;
  password: string;
}
