// Modelo de datos de un Ingrediente devuelto por el backend
export interface Ingrediente {
  id: number;
  nombre: string;
}

// Datos necesarios para crear o actualizar un ingrediente a través del formulario
export interface IngredienteFormData {
  nombre: string;
}
