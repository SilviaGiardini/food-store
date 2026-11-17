"""Endpoints de administración de usuarios."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import (
    UsuarioUnitOfWork,
    get_usuario_uow,
)

router = APIRouter(
    prefix="/api/v1/admin/usuarios",
    tags=["admin-usuarios"],
)


def get_usuario_service(
    uow: Annotated[UsuarioUnitOfWork, Depends(get_usuario_uow)],
) -> UsuarioService:
    return UsuarioService(uow)


UsuarioServiceDep = Annotated[UsuarioService, Depends(get_usuario_service)]
AdminDep = Annotated[UserPublic, Depends(require_role(["admin"]))]


@router.get("", response_model=list[UserPublic])
def listar_usuarios(
    _admin: AdminDep,
    servicio: UsuarioServiceDep,
):
    """Lista todos los usuarios, incluidos los desactivados."""
    return servicio.list_all()


@router.post(
    "/{usuario_id}/activar",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
)
def activar_usuario(
    usuario_id: int,
    admin_actual: AdminDep,
    servicio: UsuarioServiceDep,
):
    """Activa una cuenta."""
    return servicio.set_disabled(
        usuario_id=usuario_id,
        disabled=False,
        admin_id=admin_actual.id,
    )


@router.post(
    "/{usuario_id}/desactivar",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
)
def desactivar_usuario(
    usuario_id: int,
    admin_actual: AdminDep,
    servicio: UsuarioServiceDep,
):
    """Desactiva una cuenta. Un admin no puede desactivarse a sí mismo."""
    return servicio.set_disabled(
        usuario_id=usuario_id,
        disabled=True,
        admin_id=admin_actual.id,
    )
