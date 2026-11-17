"""
Schemas del módulo de usuarios: Define qué datos entran y qué datos salen.
"""

from datetime import datetime

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserCreate(SQLModel):
    """Datos que manda el cliente para registrarse."""

    username: str = Field(min_length=1)
    full_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class UserPublic(SQLModel):
    """Datos públicos de un usuario. Nunca incluye la contraseña."""

    id: int
    username: str
    full_name: str
    email: str
    role: str
    disabled: bool
    created_at: datetime
