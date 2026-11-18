// Componente para mostrar un indicador visual de carga mientras se obtienen datos del backend
interface LoadingStateProps {
  mensaje?: string;
}

export function LoadingState({ mensaje = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center my-10">
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        {mensaje}
      </p>
    </div>
  );
}

export default LoadingState;
