"""
Punto de entrada de la aplicación FastAPI.

Registra CORS con credenciales, crea las tablas al arrancar,
incluye los routers y expone /health.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables

# Estos imports no se usan directamente: registran las cinco tablas en SQLModel antes de llamar a create_all_tables().
from app.modules.usuarios.model import Usuario  
from app.modules.categorias.model import Categoria  
from app.modules.productos.model import Producto  
from app.modules.pedidos.models import DetallePedido, Pedido  

from app.modules.auth.router import router as auth_router
from app.modules.usuarios.router import router as usuarios_router
from app.modules.categorias.router import router as categorias_router
from app.modules.productos.router import router as productos_router


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

# Routers: cada uno ya incluye su prefijo /api/v1.
app.include_router(auth_router)
app.include_router(usuarios_router)
app.include_router(categorias_router)
app.include_router(productos_router)


@app.get("/health", tags=["health"])
def health_check():
    """Comprueba que el servidor esté ok."""
    return {"status": "ok"}


@app.get("/", tags=["root"])
def root():
    return {"mensaje": "Food Store API. La documentación está en /docs."}
