// Componente para mostrar un mensaje visual de error en pantalla
interface ErrorStateProps {
  mensaje: string;
}

export function ErrorState({ mensaje }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center my-10">
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2 shadow-xs">
        <span>⚠️</span>
        <span>{mensaje}</span>
      </div>
    </div>
  );
}

export default ErrorState;
