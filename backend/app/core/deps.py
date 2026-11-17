"""Dependencias de autenticación: cookie, JWT, usuario activo y roles."""

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import (
    UsuarioUnitOfWork,
    get_usuario_uow,
)


class OAuth2PasswordBearerWithCookie(OAuth2PasswordBearer):
    """Lee el JWT solamente desde la cookie HttpOnly, nunca del header."""

    async def __call__(self, request: Request) -> str | None:
        token = request.cookies.get("access_token")

        if not token:
            if self.auto_error:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="No autenticado",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return None

        return token


oauth2_scheme = OAuth2PasswordBearerWithCookie(
    tokenUrl="/api/v1/auth/token"
)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    uow: Annotated[UsuarioUnitOfWork, Depends(get_usuario_uow)],
) -> UserPublic:
    """Valida el JWT y devuelve el usuario autenticado."""
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas o token expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credenciales_invalidas

    username = payload.get("sub")
    if username is None:
        raise credenciales_invalidas

    with uow:
        usuario = uow.usuarios.get_by_username(username)
        if usuario is None:
            raise credenciales_invalidas
        return UserPublic.model_validate(usuario)


async def get_current_active_user(
    usuario_actual: Annotated[UserPublic, Depends(get_current_user)],
) -> UserPublic:
    """Rechaza las cuentas desactivadas con un 400."""
    if usuario_actual.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )
    return usuario_actual


def require_role(roles_permitidos: list[str]):
    """Devuelve una dependencia que exige uno de los roles indicados."""

    async def verificar_rol(
        usuario_actual: Annotated[
            UserPublic,
            Depends(get_current_active_user),
        ],
    ) -> UserPublic:
        if usuario_actual.role not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Permisos insuficientes. Rol actual: "
                    f"'{usuario_actual.role}'. "
                    f"Se requiere uno de: {roles_permitidos}"
                ),
            )
        return usuario_actual

    return verificar_rol
