"""Consultas propias del módulo de productos."""

from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.productos.model import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(Producto, session)

    def get_by_id(self, entidad_id: int) -> Producto | None:
        """Busca un producto y carga su categoría."""
        return self.session.exec(
            select(Producto)
            .where(Producto.id == entidad_id)
            .options(selectinload(Producto.categoria))
        ).first()

    def search(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[list[Producto], int]:
        """
        Busca productos activos con filtros y paginación.
        """
        condiciones = [Producto.activo.is_(True)]

        # Si search está vacío o es None, no filtramos por nombre.
        if search:
            condiciones.append(Producto.nombre.ilike(f"%{search}%"))

        # "is not None" porque 0 también es un id válido.
        if categoria_id is not None:
            condiciones.append(Producto.categoria_id == categoria_id)

        # "is not None" porque False es un valor válido:
        # con "if disponible:" el filtro no se aplicaría para disponible=False.
        if disponible is not None:
            condiciones.append(Producto.disponible.is_(disponible))

        total = self.session.exec(
            select(func.count()).select_from(Producto).where(*condiciones)
        ).one()

        productos = self.session.exec(
            select(Producto)
            .where(*condiciones)
            .options(selectinload(Producto.categoria))
            .order_by(Producto.nombre)
            .offset(skip)
            .limit(limit)
        ).all()

        return list(productos), total
