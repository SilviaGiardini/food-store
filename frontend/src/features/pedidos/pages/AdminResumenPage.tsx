// Panel de administración: resumen del negocio.
import { Link } from "react-router-dom";

import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { useResumenPedidos } from "../hooks/useResumenPedidos";

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

interface TarjetaResumenProps {
  etiqueta: string;
  valor: string | number;
  detalle: string;
  icono: string;
  colorIcono: string;
  colorValor: string;
}

// Dibuja una tarjeta con un número grande y una descripción corta.
function TarjetaResumen({
  etiqueta,
  valor,
  detalle,
  icono,
  colorIcono,
  colorValor,
}: TarjetaResumenProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{etiqueta}</p>
          <p className={`text-3xl font-bold mt-1 ${colorValor}`}>{valor}</p>
        </div>
        <span
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${colorIcono}`}
          aria-hidden="true"
        >
          {icono}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-3">{detalle}</p>
    </article>
  );
}

// Pide el resumen y arma la grilla de tarjetas.
export default function AdminResumenPage() {
  const { resumen, cargando, error } = useResumenPedidos();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resumen</h1>
          <p className="text-sm text-gray-500 mt-1">
            Estado general de los pedidos del negocio.
          </p>
        </div>

        <Link
          to="/admin/pedidos"
          className="self-start sm:self-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Gestionar pedidos
        </Link>
      </div>

      {cargando && <LoadingState mensaje="Cargando resumen..." />}

      {!cargando && error && (
        <ErrorState mensaje="No se pudo cargar el resumen de pedidos." />
      )}

      {!cargando && !error && resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TarjetaResumen
            etiqueta="Pendientes"
            valor={resumen.pendientes}
            detalle="Pedidos esperando preparación"
            icono="🕒"
            colorIcono="bg-amber-50 text-amber-600"
            colorValor="text-amber-700"
          />
          <TarjetaResumen
            etiqueta="En preparación"
            valor={resumen.en_preparacion}
            detalle="Pedidos que se están cocinando"
            icono="👨‍🍳"
            colorIcono="bg-blue-50 text-blue-600"
            colorValor="text-blue-700"
          />
          <TarjetaResumen
            etiqueta="Entregados"
            valor={resumen.entregados}
            detalle="Pedidos completados"
            icono="✅"
            colorIcono="bg-emerald-50 text-emerald-600"
            colorValor="text-emerald-700"
          />
          <TarjetaResumen
            etiqueta="Cancelados"
            valor={resumen.cancelados}
            detalle="Pedidos anulados"
            icono="✖️"
            colorIcono="bg-red-50 text-red-600"
            colorValor="text-red-700"
          />
          <TarjetaResumen
            etiqueta="Pedidos de hoy"
            valor={resumen.pedidos_hoy}
            detalle="Creados durante el día"
            icono="📅"
            colorIcono="bg-orange-50 text-orange-600"
            colorValor="text-orange-700"
          />
          <TarjetaResumen
            etiqueta="Ingresos entregados"
            valor={formatoPrecio.format(resumen.ingresos_entregados)}
            detalle="Total de pedidos entregados"
            icono="💰"
            colorIcono="bg-slate-100 text-slate-600"
            colorValor="text-slate-800"
          />
        </div>
      )}
    </main>
  );
}
