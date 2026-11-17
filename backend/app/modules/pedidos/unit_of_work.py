"""Unit of Work del módulo de pedidos."""

from typing import Annotated

from fastapi import Depends

from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.repository import (
    DetallePedidoRepository,
    PedidoRepository,
)
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):
    """Expone los repositorios que necesita el caso de uso de pedidos."""

    pedidos: PedidoRepository
    detalles: DetallePedidoRepository
    productos: ProductoRepository

    def __enter__(self) -> "PedidoUnitOfWork":
        super().__enter__()
        if self.session is None:
            raise RuntimeError("No se pudo abrir la sesión de pedidos")
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self


def get_pedido_uow() -> PedidoUnitOfWork:
    """Dependencia de FastAPI: un Unit of Work por request."""
    return PedidoUnitOfWork()


PedidoUowDep = Annotated[PedidoUnitOfWork, Depends(get_pedido_uow)]
