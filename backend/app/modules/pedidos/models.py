"""
Modelos de Pedido y DetallePedido.

Un pedido tiene muchas líneas (relación 1:N). Cada línea guarda una copia
del nombre y del precio del producto para que el ticket no cambie después.
"""

from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.model import Producto
    from app.modules.usuarios.model import Usuario


class Pedido(SQLModel, table=True):
    """Compra realizada por un usuario."""

    __tablename__ = "pedido"

    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id", index=True)
    estado: str = Field(default="PENDIENTE")
    forma_pago: str
    direccion_entrega: str = Field(min_length=5, max_length=200)
    notas: str | None = Field(default=None)
    total: float = Field(default=0.0, ge=0)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Cada pedido pertenece a un usuario.
    usuario: "Usuario" = Relationship(back_populates="pedidos")

    # Un pedido contiene muchas líneas. Si se borrara el pedido,
    # sus líneas se borrarían con él (composición).
    items: list["DetallePedido"] = Relationship(
        back_populates="pedido",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class DetallePedido(SQLModel, table=True):
    """Línea inmutable de un pedido, con copia del nombre y del precio."""

    __tablename__ = "detalle_pedido"

    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id", index=True)
    producto_id: int = Field(foreign_key="producto.id", index=True)
    cantidad: int = Field(ge=1)
    nombre_producto: str
    precio_unitario: float = Field(ge=0)
    subtotal: float = Field(ge=0)

    # Cada línea pertenece a un pedido y referencia un producto.
    pedido: "Pedido" = Relationship(back_populates="items")
    producto: "Producto" = Relationship(back_populates="detalles")
