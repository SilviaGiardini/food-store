"""Unit of Work del módulo de usuarios."""

from typing import Annotated

from fastapi import Depends

from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.repository import UsuarioRepository


class UsuarioUnitOfWork(UnitOfWork):
    """Expone el repositorio de usuarios sobre una sola sesión."""

    usuarios: UsuarioRepository

    def __enter__(self) -> "UsuarioUnitOfWork":
        super().__enter__()
        if self.session is None:
            raise RuntimeError("No se pudo abrir la sesión de usuarios")
        self.usuarios = UsuarioRepository(self.session)
        return self


def get_usuario_uow() -> UsuarioUnitOfWork:
    """Dependencia de FastAPI: un Unit of Work por request."""
    return UsuarioUnitOfWork()


UsuarioUowDep = Annotated[UsuarioUnitOfWork, Depends(get_usuario_uow)]
