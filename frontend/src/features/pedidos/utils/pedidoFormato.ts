// Textos, colores y fechas que comparten las pantallas de pedidos.
import type { EstadoPedido, FormaPago } from "../types/pedido";

export const etiquetasEstado: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const estilosEstado: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
};

export const etiquetasPago: Record<FormaPago, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatearFechaPedido(fecha: string) {
  // El backend guarda la fecha en UTC, pero la manda sin la "Z".
  const fechaConZona = fecha.endsWith("Z") ? fecha : `${fecha}Z`;
  return formatoFecha.format(new Date(fechaConZona));
}
