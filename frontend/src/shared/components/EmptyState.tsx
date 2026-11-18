// Componente para mostrar un mensaje cuando una tabla o lista no tiene registros
interface EmptyStateProps {
  mensaje: string;
}

export function EmptyState({ mensaje }: EmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <p className="text-sm italic text-gray-400">{mensaje}</p>
    </div>
  );
}

export default EmptyState;
