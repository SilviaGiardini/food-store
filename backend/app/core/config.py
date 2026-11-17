"""
Configuración centralizada del backend.

Lee las variables desde el archivo .env y las valida con pydantic-settings.
El resto del proyecto no debería leer variables de entorno directamente:
siempre importa `settings` desde acá.
"""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Variables de entorno que necesita la aplicación."""

    # Cadena de conexión a PostgreSQL.
    # Ejemplo: postgresql+psycopg2://usuario:password@localhost:5432/foodstore_integrador
    DATABASE_URL: str

    # Clave para firmar el JWT. El mínimo de 32 caracteres evita claves débiles.
    SECRET_KEY: str = Field(min_length=32)

    # Algoritmo y duración del token.
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Origen permitido para CORS: la URL donde corre el frontend.
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Instancia única que se importa en toda la aplicación.
settings = Settings()
