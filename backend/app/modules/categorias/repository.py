"""Consultas propias del módulo de categorías."""

from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.model import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(Categoria, session)

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        """Busca una categoría por su nombre, esté activa o no."""
        return self.session.exec(
            select(Categoria).where(Categoria.nombre == nombre)
        ).first()

    def exists_nombre_excluding(self, nombre: str, categoria_id: int) -> bool:
        """Comprueba si otra categoría ya usa ese nombre."""
        categoria = self.session.exec(
            select(Categoria).where(
                Categoria.nombre == nombre,
                Categoria.id != categoria_id,
            )
        ).first()
        return categoria is not None

    def get_activas(self) -> list[Categoria]:
        """Devuelve solo las categorías activas, ordenadas por nombre."""
        return list(
            self.session.exec(
                select(Categoria)
                .where(Categoria.activo.is_(True))
                .order_by(Categoria.nombre)
            ).all()
        )
