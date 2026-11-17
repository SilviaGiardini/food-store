"""Unit of Work del módulo de productos."""

from typing import Annotated

from fastapi import Depends

from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.repository import ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    """Expone los repositorios que necesita el caso de uso de productos."""

    productos: ProductoRepository
    categorias: CategoriaRepository

    def __enter__(self) -> "ProductoUnitOfWork":
        super().__enter__()
        if self.session is None:
            raise RuntimeError("No se pudo abrir la sesión de productos")
        self.productos = ProductoRepository(self.session)
        self.categorias = CategoriaRepository(self.session)
        return self


def get_producto_uow() -> ProductoUnitOfWork:
    """Dependencia de FastAPI: un Unit of Work por request."""
    return ProductoUnitOfWork()


ProductoUowDep = Annotated[ProductoUnitOfWork, Depends(get_producto_uow)]
