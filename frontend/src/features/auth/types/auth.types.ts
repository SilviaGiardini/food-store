export interface UsuarioAuth {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string | null;
  roles: string[];
}

export interface RegistroUsuario {
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  password: string;
}

// Representa los datos de un usuario en el listado de administración
export interface UsuarioAdmin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string | null;
  roles: string[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

