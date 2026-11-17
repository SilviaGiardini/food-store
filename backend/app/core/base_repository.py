"""Repositorio base genérico. No hace commit: eso lo hace el Unit of Work al salir del bloque."""

from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, select

Modelo = TypeVar("Modelo", bound=SQLModel)


class BaseRepository(Generic[Modelo]):
    def __init__(self, modelo: type[Modelo], session: Session):
        self.modelo = modelo
        self.session = session

    def get_by_id(self, entidad_id: int) -> Modelo | None:
        return self.session.get(self.modelo, entidad_id)

    def get_all(self) -> list[Modelo]:
        return list(self.session.exec(select(self.modelo)).all())

    def add(self, entidad: Modelo) -> Modelo:
        """Agrega una entidad nueva y obtiene su ID sin confirmar la transacción."""
        self.session.add(entidad)
        self.session.flush()
        self.session.refresh(entidad)
        return entidad

    def update(self, entidad: Modelo) -> Modelo:
        """Guarda los cambios de una entidad existente sin confirmar la transacción."""
        self.session.add(entidad)
        self.session.flush()
        self.session.refresh(entidad)
        return entidad

    def delete(self, entidad: Modelo) -> None:
        """Marca una entidad para borrarla sin confirmar la transacción."""
        self.session.delete(entidad)
        self.session.flush()
