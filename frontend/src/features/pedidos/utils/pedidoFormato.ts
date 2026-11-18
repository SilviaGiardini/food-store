// Textos y fechas que comparten las pantallas de pedidos.
import type { FormaPago } from "../types/pedido";

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
