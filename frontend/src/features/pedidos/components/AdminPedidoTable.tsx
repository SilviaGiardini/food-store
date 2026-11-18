// Tabla de pedidos del panel admin con acciones según el estado.
import type { EstadoPedido, Pedido } from "../types/pedido";
import {
  etiquetasEstado,
  estilosEstado,
  formatearFechaPedido,
} from "../utils/pedidoFormato";

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

interface AccionPedido {
  etiqueta: string;
  nuevoEstado: EstadoPedido;
  clases: string;
}

// Qué botones mostramos según el estado actual del pedido.
const accionesPorEstado: Record<EstadoPedido, AccionPedido[]> = {
  PENDIENTE: [
    {
      etiqueta: "Iniciar preparación",
      nuevoEstado: "EN_PREPARACION",
      clases:
        "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200",
    },
    {
      etiqueta: "Cancelar",
      nuevoEstado: "CANCELADO",
      clases:
        "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
    },
  ],
  EN_PREPARACION: [
    {
      etiqueta: "Marcar entregado",
      nuevoEstado: "ENTREGADO",
      clases:
        "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200",
    },
    {
      etiqueta: "Cancelar",
      nuevoEstado: "CANCELADO",
      clases:
        "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
    },
  ],
  ENTREGADO: [],
  CANCELADO: [],
};

interface AdminPedidoTableProps {
  pedidos: Pedido[];
  onCambiarEstado: (pedido: Pedido, nuevoEstado: EstadoPedido) => void;
  pedidoProcesando: number | null;
}

// Muestra cada pedido y los botones que corresponden a su estado.
export function AdminPedidoTable({
  pedidos,
  onCambiarEstado,
  pedidoProcesando,
}: AdminPedidoTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-4 py-3.5">Pedido</th>
              <th className="px-4 py-3.5">Cliente</th>
              <th className="px-4 py-3.5">Artículos</th>
              <th className="px-4 py-3.5">Total</th>
              <th className="px-4 py-3.5">Estado</th>
              <th className="px-4 py-3.5 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pedidos.map((pedido) => {
              const acciones = accionesPorEstado[pedido.estado];
              const procesando = pedidoProcesando === pedido.id;
              const resumenItems = pedido.items
                .map((item) => `${item.nombre_producto} x${item.cantidad}`)
                .join(" · ");

              return (
                <tr
                  key={pedido.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-4 py-4 align-top">
                    <p className="font-semibold text-gray-800">
                      #{pedido.id}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatearFechaPedido(pedido.created_at)}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top text-gray-600">
                    Usuario #{pedido.usuario_id}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <p className="text-gray-600 line-clamp-2">
                      {resumenItems}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {pedido.items.length} línea
                      {pedido.items.length === 1 ? "" : "s"}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top font-semibold text-gray-800">
                    {formatoPrecio.format(pedido.total)}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${estilosEstado[pedido.estado]}`}
                    >
                      {etiquetasEstado[pedido.estado]}
                    </span>
                  </td>

                  <td className="px-4 py-4 align-top">
                    {acciones.length === 0 ? (
                      <p className="text-center text-xs text-gray-400">
                        Sin acciones
                      </p>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-2">
                        {acciones.map((accion) => (
                          <button
                            key={accion.nuevoEstado}
                            type="button"
                            onClick={() =>
                              onCambiarEstado(pedido, accion.nuevoEstado)
                            }
                            disabled={procesando}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${accion.clases}`}
                          >
                            {procesando ? "Procesando..." : accion.etiqueta}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPedidoTable;
