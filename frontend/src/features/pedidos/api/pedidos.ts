// Funciones HTTP del módulo de pedidos.
import { api } from "@/shared/api/axiosInstance";
import type {
  EstadoPedido,
  Pedido,
  PedidoCreate,
  PedidosPaginados,
  ResumenPedidos,
} from "../types/pedido";

interface FiltrosPedidos {
  skip?: number;
  limit?: number;
  estado?: EstadoPedido;
}

export async function crearPedido(datos: PedidoCreate): Promise<Pedido> {
  const respuesta = await api.post<Pedido>("/pedidos", datos);
  return respuesta.data;
}

export async function listarPedidos(
  filtros: FiltrosPedidos = {}
): Promise<PedidosPaginados> {
  const respuesta = await api.get<PedidosPaginados>("/pedidos", {
    params: {
      skip: filtros.skip,
      limit: filtros.limit,
      estado: filtros.estado,
    },
  });
  return respuesta.data;
}

export async function cancelarPedido(pedidoId: number): Promise<Pedido> {
  const respuesta = await api.patch<Pedido>(
    `/pedidos/${pedidoId}/cancelar`
  );
  return respuesta.data;
}

export async function cambiarEstadoPedido(
  pedidoId: number,
  estado: EstadoPedido
): Promise<Pedido> {
  const respuesta = await api.patch<Pedido>(
    `/pedidos/${pedidoId}/estado`,
    { estado }
  );
  return respuesta.data;
}

export async function obtenerResumenPedidos(): Promise<ResumenPedidos> {
  const respuesta = await api.get<ResumenPedidos>("/pedidos/resumen");
  return respuesta.data;
}
