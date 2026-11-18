// Página con los pedidos del cliente y la opción de cancelar los pendientes.
import { Link } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PedidoCard } from "../components/PedidoCard";
import { useCancelarPedido } from "../hooks/useCancelarPedido";
import { usePedidos } from "../hooks/usePedidos";
import type { Pedido } from "../types/pedido";

export default function MisPedidosPage() {
  const { usuario } = useAuth();
  const { pedidos, cargando, error } = usePedidos();
  const cancelarPedido = useCancelarPedido();

  // El admin recibe todos los pedidos; en esta pantalla mostramos solo los suyos.
  const pedidosPropios = pedidos.filter(
    (pedido) => pedido.usuario_id === usuario?.id
  );

  const handleCancelar = (pedido: Pedido) => {
    const confirmado = window.confirm(
      `¿Querés cancelar el pedido #${pedido.id}?`
    );
    if (!confirmado) return;

    cancelarPedido.mutate(pedido.id);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis pedidos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Revisá el detalle y cancelá los pedidos que todavía están pendientes.
        </p>
      </div>

      {cargando && <LoadingState mensaje="Cargando pedidos..." />}

      {!cargando && error && (
        <ErrorState mensaje="No se pudieron cargar tus pedidos." />
      )}

      {!cargando && !error && pedidosPropios.length === 0 && (
        <>
          <EmptyState mensaje="Todavía no hiciste ningún pedido." />
          <div className="text-center mt-2">
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        </>
      )}

      {!cargando && !error && pedidosPropios.length > 0 && (
        <div className="space-y-4">
          {pedidosPropios.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              onCancelar={handleCancelar}
              cancelando={
                cancelarPedido.isPending &&
                cancelarPedido.variables === pedido.id
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
