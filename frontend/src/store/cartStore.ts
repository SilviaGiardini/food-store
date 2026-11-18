// Guarda el carrito en el navegador con Zustand y persist.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
}

interface CartState {
  items: ItemCarrito[];
  agregar: (
    item: Omit<ItemCarrito, "cantidad">,
    cantidad?: number
  ) => void;
  quitar: (producto_id: number) => void;
  cambiarCantidad: (producto_id: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (item, cantidad = 1) => {
        if (cantidad <= 0) return;

        const existente = get().items.find(
          (itemCarrito) => itemCarrito.producto_id === item.producto_id
        );

        if (existente) {
          set({
            items: get().items.map((itemCarrito) =>
              itemCarrito.producto_id === item.producto_id
                ? {
                    ...itemCarrito,
                    cantidad: itemCarrito.cantidad + cantidad,
                  }
                : itemCarrito
            ),
          });
          return;
        }

        set({
          items: [...get().items, { ...item, cantidad }],
        });
      },

      quitar: (producto_id) => {
        set({
          items: get().items.filter(
            (itemCarrito) => itemCarrito.producto_id !== producto_id
          ),
        });
      },

      cambiarCantidad: (producto_id, cantidad) => {
        if (cantidad <= 0) {
          get().quitar(producto_id);
          return;
        }

        set({
          items: get().items.map((itemCarrito) =>
            itemCarrito.producto_id === producto_id
              ? { ...itemCarrito, cantidad }
              : itemCarrito
          ),
        });
      },

      vaciar: () => {
        set({ items: [] });
      },

      total: () => {
        return get().items.reduce(
          (suma, itemCarrito) =>
            suma + itemCarrito.precio_unitario * itemCarrito.cantidad,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
