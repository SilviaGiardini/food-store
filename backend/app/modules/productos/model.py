"""
Modelo de la tabla Producto.

Cada producto pertenece a una sola categoría (relación 1:N).
Se vende solo si está activo, disponible y con stock suficiente.
"""

from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.categorias.model import Categoria
    from app.modules.pedidos.models import DetallePedido


class Producto(SQLModel, table=True):
    """Plato o artículo que se puede pedir."""

    __tablename__ = "producto"

    id: int | None = Field(default=None, primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", index=True)
    nombre: str = Field(index=True)
    descripcion: str | None = Field(default=None)
    precio_base: float = Field(ge=0)
    imagen_url: str | None = Field(default=None)
    stock: int = Field(default=0, ge=0)
    disponible: bool = Field(default=True)
    activo: bool = Field(default=True)

    # Cada producto pertenece a una categoría.
    categoria: "Categoria" = Relationship(back_populates="productos")

    # Un producto puede aparecer en muchos detalles de pedidos.
    detalles: list["DetallePedido"] = Relationship(back_populates="producto")
