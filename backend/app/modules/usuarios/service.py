"""
Service de usuarios para el panel de administración.

Aplica las reglas de listado, activación y desactivación. El control de rol lo hace el Router con require_role(["admin"]).
"""

from fastapi import HTTPException, status

from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    """Reglas de negocio para gestionar usuarios."""

    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def list_all(self) -> list[UserPublic]:
        """Devuelve todos los usuarios, incluidos los desactivados."""
        with self.uow as uow:
            usuarios = uow.usuarios.get_all()
            return [
                UserPublic.model_validate(usuario)
                for usuario in usuarios
            ]

    def set_disabled(
        self,
        usuario_id: int,
        disabled: bool,
        admin_id: int,
    ) -> UserPublic:
        """Activa o desactiva una cuenta."""
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id)
            if usuario is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Usuario no encontrado",
                )

            # Un admin no puede dejar su propia cuenta sin acceso.
            if disabled and usuario.id == admin_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Un administrador no puede desactivarse a sí mismo",
                )

            usuario.disabled = disabled
            usuario_actualizado = uow.usuarios.update(usuario)
            return UserPublic.model_validate(usuario_actualizado)
