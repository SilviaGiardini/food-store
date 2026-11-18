// Badge visual para los cuatro estados de un pedido.
export type EstadoPedidoBadge =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "ENTREGADO"
  | "CANCELADO";

const etiquetas: Record<EstadoPedidoBadge, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const estilos: Record<EstadoPedidoBadge, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
};

interface BadgeEstadoProps {
  estado: EstadoPedidoBadge;
}

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${estilos[estado]}`}
    >
      {etiquetas[estado]}
    </span>
  );
}

export default BadgeEstado;
