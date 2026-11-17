"""
Punto de entrada de la aplicación FastAPI.

Registra CORS con credenciales, crea las tablas al arrancar y expone /health.
Los routers de cada módulo se agregan en las partes siguientes del trabajo.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables

# Estos imports sirven para que SQLModel registre las cinco tablas antes de llamar a create_all_tables().
from app.modules.usuarios.model import Usuario  
from app.modules.categorias.model import Categoria  
from app.modules.productos.model import Producto  
from app.modules.pedidos.models import DetallePedido, Pedido  


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crea las tablas cuando arranca el servidor."""
    create_all_tables()
    yield


app = FastAPI(
    title="Food Store API",
    description="API del Trabajo Práctico Integrador de Programación 4",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS con credenciales: el navegador tiene que poder enviar la cookie HttpOnly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prefijo común de todos los endpoints de la API.
API_PREFIX = "/api/v1"


@app.get("/health", tags=["health"])
def health_check():
    """Comprueba que el servidor esté vivo."""
    return {"status": "ok"}


@app.get("/", tags=["root"])
def root():
    """Mensaje simple para abrir la raíz del servidor."""
    return {"mensaje": "Food Store API. La documentación está en /docs."}
