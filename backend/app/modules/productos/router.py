"""Endpoints de productos."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status

from app.core.deps import require_role
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductoStockUpdate,
    ProductosPaginados,
    ProductoUpdate,
)
from app.modules.productos.service import (
    CategoriaNoEncontrada,
    ProductoNoEncontrado,
    ProductoService,
)
from app.modules.productos.unit_of_work import (
    ProductoUnitOfWork,
    get_producto_uow,
)
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/api/v1/productos", tags=["productos"])


def get_producto_service(
    uow: Annotated[ProductoUnitOfWork, Depends(get_producto_uow)],
) -> ProductoService:
    return ProductoService(uow)


ProductoServiceDep = Annotated[
    ProductoService,
    Depends(get_producto_service),
]
AdminDep = Annotated[UserPublic, Depends(require_role(["admin"]))]


@router.get("", response_model=ProductosPaginados)
def listar_productos(
    servicio: ProductoServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    categoria_id: int | None = Query(default=None, gt=0),
    disponible: bool | None = Query(default=None),
):
    return servicio.listar(
        skip=skip,
        limit=limit,
        search=search,
        categoria_id=categoria_id,
        disponible=disponible,
    )


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(
    producto_id: int,
    servicio: ProductoServiceDep,
):
    try:
        return servicio.obtener_por_id(producto_id)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.post(
    "",
    response_model=ProductoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_producto(
    datos: ProductoCreate,
    _admin: AdminDep,
    servicio: ProductoServiceDep,
):
    try:
        return servicio.crear(datos)
    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    _admin: AdminDep,
    servicio: ProductoServiceDep,
):
    try:
        return servicio.actualizar(producto_id, datos)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.patch("/{producto_id}/stock", response_model=ProductoRead)
def actualizar_stock(
    producto_id: int,
    datos: ProductoStockUpdate,
    _admin: AdminDep,
    servicio: ProductoServiceDep,
):
    try:
        return servicio.actualizar_stock(producto_id, datos)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    producto_id: int,
    _admin: AdminDep,
    servicio: ProductoServiceDep,
):
    try:
        servicio.eliminar(producto_id)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
