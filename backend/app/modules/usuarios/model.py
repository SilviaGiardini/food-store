"""
Modelo de la tabla Usuario.

Un usuario puede ser cliente (`role="user"`) o administrador (`role="admin"`).
La baja es lógica: se marca `disabled=True` en lugar de borrar la fila.
"""

from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.pedidos.models import Pedido


class Usuario(SQLModel, table=True):
    """Persona que compra o administra el negocio."""

    __tablename__ = "usuario"

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: str = Field(default="user")
    disabled: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    pedidos: list["Pedido"] = Relationship(back_populates="usuario")
