"""Reglas de negocio de pedidos."""

from datetime import datetime, timezone

from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import (
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

TRANSICIONES = {
    EstadoPedido.PENDIENTE: {
        EstadoPedido.EN_PREPARACION,
        EstadoPedido.CANCELADO,
    },
    EstadoPedido.EN_PREPARACION: {
        EstadoPedido.ENTREGADO,
        EstadoPedido.CANCELADO,
    },
    EstadoPedido.ENTREGADO: set(),
    EstadoPedido.CANCELADO: set(),
}


class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(f"Producto con id {producto_id} no encontrado")


class ProductoNoDisponible(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(
            f"El producto con id {producto_id} no está disponible"
        )


class StockInsuficiente(Exception):
    def __init__(self, producto_id: int, stock: int, cantidad: int):
        self.producto_id = producto_id
        self.stock = stock
        self.cantidad = cantidad
        super().__init__(
            f"Stock insuficiente para el producto {producto_id}: "
            f"hay {stock} y se pidieron {cantidad}"
        )


class ProductoRepetido(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(
            f"El producto {producto_id} está repetido en el pedido"
        )


class PedidoNoEncontrado(Exception):
    def __init__(self, pedido_id: int):
        self.pedido_id = pedido_id
        super().__init__(f"Pedido con id {pedido_id} no encontrado")


class PedidoAjeno(Exception):
    def __init__(self, pedido_id: int):
        self.pedido_id = pedido_id
        super().__init__(
            f"El pedido {pedido_id} pertenece a otro usuario"
        )


class TransicionInvalida(Exception):
    def __init__(self, estado_actual: str, estado_nuevo: str):
        self.estado_actual = estado_actual
        self.estado_nuevo = estado_nuevo
        super().__init__(
            f"No se puede pasar de {estado_actual} a {estado_nuevo}"
        )


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear(
        self,
        datos: PedidoCreate,
        usuario_id: int,
    ) -> PedidoRead:
        with self.uow as uow:
            productos_vistos: set[int] = set()
            for item in datos.items:
                if item.producto_id in productos_vistos:
                    raise ProductoRepetido(item.producto_id)
                productos_vistos.add(item.producto_id)

            pedido = Pedido(
                usuario_id=usuario_id,
                estado=EstadoPedido.PENDIENTE.value,
                forma_pago=datos.forma_pago.value,
                direccion_entrega=datos.direccion_entrega,
                notas=datos.notas,
                total=0.0,
            )
            pedido_guardado = uow.pedidos.add(pedido)

            total = 0.0
            for item in datos.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(item.producto_id)

                if not producto.disponible:
                    raise ProductoNoDisponible(item.producto_id)

                if producto.stock < item.cantidad:
                    raise StockInsuficiente(
                        item.producto_id,
                        producto.stock,
                        item.cantidad,
                    )

                producto.stock -= item.cantidad
                uow.productos.update(producto)

                subtotal = round(
                    producto.precio_base * item.cantidad,
                    2,
                )
                detalle = DetallePedido(
                    pedido_id=pedido_guardado.id,
                    producto_id=producto.id,
                    cantidad=item.cantidad,
                    nombre_producto=producto.nombre,
                    precio_unitario=producto.precio_base,
                    subtotal=subtotal,
                )
                uow.detalles.add(detalle)
                total += subtotal

            pedido_guardado.total = round(total, 2)
            uow.pedidos.update(pedido_guardado)

            pedido_completo = uow.pedidos.get_by_id(pedido_guardado.id)
            if pedido_completo is None:
                raise PedidoNoEncontrado(pedido_guardado.id)
            return PedidoRead.model_validate(pedido_completo)

    def listar(
        self,
        usuario_id: int,
        es_admin: bool,
        skip: int,
        limit: int,
        estado: str | None,
    ) -> PedidosPaginados:
        with self.uow as uow:
            if es_admin:
                pedidos, total = uow.pedidos.list_all(
                    skip=skip,
                    limit=limit,
                    estado=estado,
                )
            else:
                pedidos, total = uow.pedidos.list_by_usuario(
                    usuario_id=usuario_id,
                    skip=skip,
                    limit=limit,
                    estado=estado,
                )

            items = [
                PedidoRead.model_validate(pedido)
                for pedido in pedidos
            ]
            return PedidosPaginados(total=total, items=items)

    def obtener_por_id(
        self,
        pedido_id: int,
        usuario_id: int,
        es_admin: bool,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            if not es_admin and pedido.usuario_id != usuario_id:
                raise PedidoAjeno(pedido_id)

            return PedidoRead.model_validate(pedido)

    def cambiar_estado(
        self,
        pedido_id: int,
        nuevo_estado: EstadoPedido,
    ) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            estado_actual = EstadoPedido(pedido.estado)
            if nuevo_estado not in TRANSICIONES[estado_actual]:
                raise TransicionInvalida(
                    estado_actual.value,
                    nuevo_estado.value,
                )

            if nuevo_estado == EstadoPedido.CANCELADO:
                self._restituir_stock(uow, pedido)

            pedido.estado = nuevo_estado.value
            pedido.updated_at = datetime.now(timezone.utc)
            uow.pedidos.update(pedido)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado(pedido_id)

            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno(pedido_id)

            if pedido.estado != EstadoPedido.PENDIENTE.value:
                raise TransicionInvalida(
                    pedido.estado,
                    EstadoPedido.CANCELADO.value,
                )

            self._restituir_stock(uow, pedido)
            pedido.estado = EstadoPedido.CANCELADO.value
            pedido.updated_at = datetime.now(timezone.utc)
            uow.pedidos.update(pedido)
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            conteos = uow.pedidos.count_by_estado()
            return ResumenPedidos(
                pendientes=conteos.get(EstadoPedido.PENDIENTE.value, 0),
                en_preparacion=conteos.get(
                    EstadoPedido.EN_PREPARACION.value,
                    0,
                ),
                entregados=conteos.get(EstadoPedido.ENTREGADO.value, 0),
                cancelados=conteos.get(EstadoPedido.CANCELADO.value, 0),
                pedidos_hoy=uow.pedidos.pedidos_hoy(),
                ingresos_entregados=uow.pedidos.ingresos_entregados(),
            )

    def _restituir_stock(
        self,
        uow: PedidoUnitOfWork,
        pedido: Pedido,
    ) -> None:
        for detalle in pedido.items:
            producto = uow.productos.get_by_id(detalle.producto_id)
            if producto is not None:
                producto.stock += detalle.cantidad
                uow.productos.update(producto)
