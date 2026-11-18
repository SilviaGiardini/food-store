// Barrel export: API pública del módulo de productos
export { default as ProductsPage } from "./pages/ProductsPage";
export { default as ProductoList } from "./components/ProductoList";
export { ProductoModal } from "./components/ProductoModal";
export { useProducts } from "./hooks/useProducts";
export { useCatalogoProductos } from "./hooks/useCatalogoProductos";
export type * from "./types/producto";
