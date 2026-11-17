"""
Funciones de seguridad del backend.
Contraseñas: se guardan como hash bcrypt, nunca en texto plano.
Tokens: se crean y validan JWT firmados con la SECRET_KEY.
"""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Passlib usa bcrypt para generar hashes irreversibles.
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """
    Convierte una contraseña en un hash bcrypt.
    """
    return password_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Devuelve True si la contraseña coincide con el hash guardado."""
    return password_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict[str, Any],
    expires_delta: timedelta | None = None,
) -> str:
    """
    Crea un JWT firmado con la SECRET_KEY.
    `data` debe incluir al menos "sub".
    Si no se indica `expires_delta`, usa la duración configurada.
    """
    payload = data.copy()
    duracion = expires_delta or timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload.update(
        {
            "type": "access",
            "exp": datetime.now(timezone.utc) + duracion,
        }
    )
    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(token: str) -> dict[str, Any] | None:
    """
    Valida la firma y la expiración de un JWT.
    Devuelve el payload si el token es válido.
    Devuelve None si está vencido, modificado o firmado con otra clave.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        return None

    # Solo acepta tokens de acceso, no otros tipos de token.
    if payload.get("type") != "access":
        return None

    return payload
