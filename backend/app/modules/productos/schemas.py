"""Schemas de entrada y salida para productos."""

from pydantic import field_validator
from sqlmodel import Field, SQLModel

from app.modules.categorias.schemas import CategoriaRead


class ProductoCreate(SQLModel):
    categoria_id: int = Field(gt=0)
    nombre: str = Field(min_length=1)
    descripcion: str | None = None
    precio_base: float = Field(ge=0)
    imagen_url: str | None = None
    stock: int = Field(default=0, ge=0)
    disponible: bool = True


class ProductoUpdate(SQLModel):
    categoria_id: int | None = Field(default=None, gt=0)
    nombre: str | None = Field(default=None, min_length=1)
    descripcion: str | None = None
    precio_base: float | None = Field(default=None, ge=0)
    imagen_url: str | None = None
    stock: int | None = Field(default=None, ge=0)
    disponible: bool | None = None

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, valor: str | None) -> str | None:
        if valor is None:
            raise ValueError("El nombre no puede ser nulo")
        return valor

    @field_validator("categoria_id")
    @classmethod
    def validar_categoria(cls, valor: int | None) -> int | None:
        if valor is None:
            raise ValueError("La categoría no puede ser nula")
        return valor


class ProductoStockUpdate(SQLModel):
    stock: int = Field(ge=0)
    disponible: bool


class ProductoRead(SQLModel):
    id: int
    categoria_id: int
    nombre: str
    descripcion: str | None
    precio_base: float
    imagen_url: str | None
    stock: int
    disponible: bool
    activo: bool
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
