"""Unit of Work del módulo de categorías."""

from typing import Annotated

from fastapi import Depends

from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository


class CategoriaUnitOfWork(UnitOfWork):
    """Expone el repositorio de categorías sobre una sola sesión."""

    categorias: CategoriaRepository

    def __enter__(self) -> "CategoriaUnitOfWork":
        super().__enter__()
        if self.session is None:
            raise RuntimeError("No se pudo abrir la sesión de categorías")
        self.categorias = CategoriaRepository(self.session)
        return self


def get_categoria_uow() -> CategoriaUnitOfWork:
    """Dependencia de FastAPI: un Unit of Work por request."""
    return CategoriaUnitOfWork()


CategoriaUowDep = Annotated[CategoriaUnitOfWork, Depends(get_categoria_uow)]
