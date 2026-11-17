"""
Conexión a la base de datos y creación de tablas.

El engine se crea una sola vez y se reutiliza en toda la aplicación.
Las sesiones las abre el Unit of Work, no los routers.
"""

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# echo=False para no llenar la consola con el SQL de cada consulta.
engine = create_engine(settings.DATABASE_URL, echo=False)


def create_all_tables() -> None:
    """Crea en PostgreSQL las tablas que todavía no existan."""
    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    """
    Devuelve una sesión nueva.

    expire_on_commit=False permite leer los objetos después del commit,
    cuando FastAPI arma la respuesta fuera del bloque del Unit of Work.
    """
    return Session(engine, expire_on_commit=False)
