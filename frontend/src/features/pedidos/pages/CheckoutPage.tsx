// Página de checkout: formulario y creación del pedido.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";

import { handleApiError } from "@/shared/api/handleApiError";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/store/cartStore";
import { CarritoVacioEstado } from "../components/CarritoVacioEstado";
import { useCrearPedido } from "../hooks/useCrearPedido";
import type { FormaPago } from "../types/pedido";

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const crearPedido = useCrearPedido();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        const direccion = value.direccion_entrega.trim();
        if (direccion.length < 5) {
          return {
            fields: {
              direccion_entrega:
                "La dirección debe tener al menos 5 caracteres",
            },
          };
        }
        if (direccion.length > 200) {
          return {
            fields: {
              direccion_entrega:
                "La dirección no puede superar los 200 caracteres",
            },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setError(null);
      try {
        await crearPedido.mutateAsync({
          items: items.map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
          })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || undefined,
        });

        navigate("/mis-pedidos");
      } catch (err: unknown) {
        setError(handleApiError(err, "No se pudo crear el pedido"));
      }
    },
  });

  const inputClass =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        <CarritoVacioEstado />
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          Confirmá la dirección y la forma de pago.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            form.handleSubmit();
          }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4"
        >
          <form.Field
            name="direccion_entrega"
            validators={{
              onBlur: ({ value }) =>
                value.trim().length < 5
                  ? "La dirección debe tener al menos 5 caracteres"
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <label
                  htmlFor="direccion_entrega"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Dirección de entrega
                </label>
                <input
                  id="direccion_entrega"
                  type="text"
                  className={inputClass}
                  placeholder="Ej: Calle 123, piso 2"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(evento.target.value)
                  }
                />
                {field.state.meta.errors.map((errorValidacion) => (
                  <p
                    key={String(errorValidacion)}
                    className="mt-1 text-xs text-red-500"
                  >
                    {String(errorValidacion)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="forma_pago">
            {(field) => (
              <div>
                <label
                  htmlFor="forma_pago"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Forma de pago
                </label>
                <select
                  id="forma_pago"
                  className={inputClass}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(evento.target.value as FormaPago)
                  }
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="notas">
            {(field) => (
              <div>
                <label
                  htmlFor="notas"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Notas <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <textarea
                  id="notas"
                  rows={3}
                  className={inputClass}
                  placeholder="Ej: timbre roto, dejar en portería"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(evento) =>
                    field.handleChange(evento.target.value)
                  }
                />
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                disabled={isSubmitting || crearPedido.isPending}
                className="w-full"
              >
                {isSubmitting || crearPedido.isPending
                  ? "Confirmando..."
                  : "Confirmar pedido"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen</h2>

          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.producto_id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="text-gray-600">
                  {item.nombre}{" "}
                  <span className="text-gray-400">x{item.cantidad}</span>
                </span>
                <span className="text-gray-800 font-medium">
                  {formatoPrecio.format(
                    item.precio_unitario * item.cantidad
                  )}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold text-gray-900">
              {formatoPrecio.format(total)}
            </span>
          </div>

          <Link
            to="/carrito"
            className="block text-center mt-4 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Volver al carrito
          </Link>
        </aside>
      </div>
    </main>
  );
}
