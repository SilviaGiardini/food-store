"""
Schemas del módulo de autenticación.
El token no se devuelve en el cuerpo: viaja en una cookie HttpOnly.
El cuerpo de login y logout solo lleva un mensaje.
"""

from sqlmodel import SQLModel


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class MessageResponse(SQLModel):
    """Respuesta simple para login y logout."""

    message: str
