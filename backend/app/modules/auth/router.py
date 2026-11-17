"""Endpoints de autenticación."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.deps import get_current_active_user
from app.modules.auth.schemas import MessageResponse
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import (
    UsuarioUnitOfWork,
    get_usuario_uow,
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


def get_auth_service(
    uow: Annotated[UsuarioUnitOfWork, Depends(get_usuario_uow)],
) -> AuthService:
    """Dependencia que arma el Service con su Unit of Work."""
    return AuthService(uow)


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


@router.post(
    "/register",
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar un usuario nuevo",
)
def register(datos: UserCreate, servicio: AuthServiceDep):
    """Registro público: siempre crea un usuario con rol 'user'."""
    return servicio.register(datos)


@router.post(
    "/token",
    response_model=MessageResponse,
    summary="Iniciar sesión y entregar el JWT en una cookie HttpOnly",
)
def login(
    formulario: Annotated[OAuth2PasswordRequestForm, Depends()],
    servicio: AuthServiceDep,
    respuesta: Response,
):
    """Valida usuario y contraseña; el token viaja en la cookie."""
    token = servicio.authenticate(
        formulario.username,
        formulario.password,
    )

    respuesta.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        max_age=token.expires_in,
        samesite="lax",
        secure=False,
    )

    return MessageResponse(message="Login exitoso")


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Cerrar sesión y borrar la cookie",
)
def logout(respuesta: Response):
    """Borra la cookie del navegador."""
    respuesta.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return MessageResponse(message="Sesión cerrada correctamente")


@router.get(
    "/me",
    response_model=UserPublic,
    summary="Datos del usuario autenticado",
)
def me(
    usuario_actual: Annotated[
        UserPublic,
        Depends(get_current_active_user),
    ],
):
    """Devuelve el usuario de la sesión actual."""
    return usuario_actual
