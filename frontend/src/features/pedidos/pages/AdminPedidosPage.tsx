// Panel de administración: listado y cambio de estado de pedidos.
import { useState } from "react";

import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { AdminPedidoTable } from "../components/AdminPedidoTable";
import { useAdminPedidos } from "../hooks/useAdminPedidos";
import { useCambiarEstadoPedido } from "../hooks/useCambiarEstadoPedido";
import type { EstadoPedido, Pedido } from "../types/pedido";

const opcionesEstado: { valor: EstadoPedido; etiqueta: string }[] = [
  { valor: "PENDIENTE", etiqueta: "Pendiente" },
  { valor: "EN_PREPARACION", etiqueta: "En preparación" },
  { valor: "ENTREGADO", etiqueta: "Entregado" },
  { valor: "CANCELADO", etiqueta: "Cancelado" },
];

// Lista los pedidos, permite filtrar y cambiar el estado.
export default function AdminPedidosPage() {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | "">("");
  const { pedidos, total, cargando, error } = useAdminPedidos(
    estadoFiltro || undefined
  );
  const cambiarEstado = useCambiarEstadoPedido();

  const pedidoProcesando = cambiarEstado.isPending
    ? cambiarEstado.variables?.pedidoId ?? null
    : null;

  // Si se cancela, pedimos confirmación porque el stock vuelve al catálogo.
  const handleCambiarEstado = (
    pedido: Pedido,
    nuevoEstado: EstadoPedido
  ) => {
    if (nuevoEstado === "CANCELADO") {
      const confirmado = window.confirm(
        `¿Cancelar el pedido #${pedido.id}? El stock va a volver al catálogo.`
      );
      if (!confirmado) return;
    }

    cambiarEstado.mutate({
      pedidoId: pedido.id,
      estado: nuevoEstado,
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Avanzá los pedidos según su estado o cancelalos si corresponde.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <span className="text-sm text-gray-500">
            {total} pedido{total === 1 ? "" : "s"}
          </span>

          <div>
            <label
              htmlFor="filtro-estado"
              className="block text-xs font-medium text-gray-500 mb-1"
            >
              Filtrar por estado
            </label>
            <select
              id="filtro-estado"
              value={estadoFiltro}
              onChange={(evento) =>
                setEstadoFiltro(evento.target.value as EstadoPedido | "")
              }
              className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              {opcionesEstado.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {cargando && <LoadingState mensaje="Cargando pedidos..." />}

      {!cargando && error && (
        <ErrorState mensaje="No se pudieron cargar los pedidos." />
      )}

      {!cargando && !error && pedidos.length === 0 && (
        <EmptyState
          mensaje={
            estadoFiltro
              ? "No hay pedidos con ese estado."
              : "Todavía no hay pedidos."
          }
        />
      )}

      {!cargando && !error && pedidos.length > 0 && (
        <AdminPedidoTable
          pedidos={pedidos}
          onCambiarEstado={handleCambiarEstado}
          pedidoProcesando={pedidoProcesando}
        />
      )}
    </main>
  );
}
