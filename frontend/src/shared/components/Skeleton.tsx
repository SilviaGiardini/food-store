// Bloques de carga para listados.
interface SkeletonProps {
  cantidad?: number;
}

export function Skeleton({ cantidad = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cantidad }).map((_, indice) => (
        <div
          key={indice}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="h-40 w-full bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
