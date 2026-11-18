// Tarjeta con el detalle de un pedido y el botón para cancelarlo.
import type { EstadoPedido, Pedido } from "../types/pedido";

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const etiquetasEstado: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const estilosEstado: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-emerald-100 text-emerald-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const etiquetasPago: Record<Pedido["forma_pago"], string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

function formatearFecha(fecha: string) {
  // El backend guarda la fecha en UTC, pero la manda sin la "Z".
  const fechaConZona = fecha.endsWith("Z") ? fecha : `${fecha}Z`;
  return formatoFecha.format(new Date(fechaConZona));
}

interface PedidoCardProps {
  pedido: Pedido;
  onCancelar: (pedido: Pedido) => void;
  cancelando: boolean;
}

export function PedidoCard({
  pedido,
  onCancelar,
  cancelando,
}: PedidoCardProps) {
  // Solo los pedidos pendientes se pueden cancelar.
  const puedeCancelar = pedido.estado === "PENDIENTE";

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Pedido #{pedido.id}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatearFecha(pedido.created_at)}
          </p>
        </div>

        <span
          className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold ${estilosEstado[pedido.estado]}`}
        >
          {etiquetasEstado[pedido.estado]}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <ul className="space-y-2">
          {pedido.items.map((item) => (
            <li
              key={item.producto_id}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="text-gray-600">
                {item.nombre_producto}{" "}
                <span className="text-gray-400">x{item.cantidad}</span>
              </span>
              <span className="font-medium text-gray-800">
                {formatoPrecio.format(item.subtotal)}
              </span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-sm">
          <p>
            <span className="font-medium text-gray-700">Entrega: </span>
            <span className="text-gray-600">{pedido.direccion_entrega}</span>
          </p>
          <p>
            <span className="font-medium text-gray-700">Pago: </span>
            <span className="text-gray-600">
              {etiquetasPago[pedido.forma_pago]}
            </span>
          </p>
          {pedido.notas && (
            <p className="sm:col-span-2">
              <span className="font-medium text-gray-700">Notas: </span>
              <span className="text-gray-600">{pedido.notas}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Total:{" "}
            <span className="text-xl font-bold text-gray-900 ml-1">
              {formatoPrecio.format(pedido.total)}
            </span>
          </p>

          {puedeCancelar && (
            <button
              type="button"
              onClick={() => onCancelar(pedido)}
              disabled={cancelando}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelando ? "Cancelando..." : "Cancelar pedido"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default PedidoCard;
