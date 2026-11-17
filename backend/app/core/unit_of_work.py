"""
Unit of Work base.
Abre una sesión al entrar al bloque `with` y la cierra al salir.
Si todo salió bien, hace commit; si hubo una excepción, hace rollback.
"""

from types import TracebackType
from typing import Callable

from sqlmodel import Session

from app.core.database import session_factory as default_session_factory


class UnitOfWork:
    """Maneja una transacción completa: abrir, confirmar o revertir, y cerrar."""

    def __init__(
        self,
        session_factory: Callable[[], Session] = default_session_factory,
    ):
        self._session_factory = session_factory
        self.session: Session | None = None

    def __enter__(self) -> "UnitOfWork":
        self.session = self._session_factory()
        return self

    def __exit__(
        self,
        tipo_excepcion: type[BaseException] | None,
        valor_excepcion: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        try:
            if tipo_excepcion is not None:
                self.rollback()
            else:
                self.commit()
        finally:
            self.close()

    def commit(self) -> None:
        """Confirma la transacción. Solo lo usa el Unit of Work."""
        if self.session is not None:
            self.session.commit()

    def rollback(self) -> None:
        """Revierte la transacción. Solo lo usa el Unit of Work."""
        if self.session is not None:
            self.session.rollback()

    def close(self) -> None:
        """Cierra la sesión y libera la conexión."""
        if self.session is not None:
            self.session.close()
            self.session = None
