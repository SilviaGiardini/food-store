"""
Modelo de la tabla Categoria.

Una categoría agrupa muchos productos (relación 1:N).
La baja es lógica: se marca `activo=False`; el nombre único no se libera.
"""

from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.productos.model import Producto


class Categoria(SQLModel, table=True):
    """Sección del menú, por ejemplo Pizzas o Bebidas."""

    __tablename__ = "categoria"

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True, min_length=2, max_length=100)
    descripcion: str | None = Field(default=None)
    activo: bool = Field(default=True)

    # Una categoría tiene muchos productos.
    productos: list["Producto"] = Relationship(back_populates="categoria")
