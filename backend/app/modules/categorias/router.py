"""Endpoints de categorías."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.core.deps import require_role
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.service import (
    CategoriaNoEncontrada,
    CategoriaService,
    NombreDuplicado,
)
from app.modules.categorias.unit_of_work import (
    CategoriaUnitOfWork,
    get_categoria_uow,
)
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/api/v1/categorias", tags=["categorias"])


def get_categoria_service(
    uow: Annotated[CategoriaUnitOfWork, Depends(get_categoria_uow)],
) -> CategoriaService:
    return CategoriaService(uow)


CategoriaServiceDep = Annotated[
    CategoriaService,
    Depends(get_categoria_service),
]
AdminDep = Annotated[UserPublic, Depends(require_role(["admin"]))]


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(servicio: CategoriaServiceDep):
    return servicio.listar_activas()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(
    categoria_id: int,
    servicio: CategoriaServiceDep,
):
    try:
        return servicio.obtener_por_id(categoria_id)
    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.post(
    "",
    response_model=CategoriaRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_categoria(
    datos: CategoriaCreate,
    _admin: AdminDep,
    servicio: CategoriaServiceDep,
):
    try:
        return servicio.crear(datos)
    except NombreDuplicado as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int,
    datos: CategoriaUpdate,
    _admin: AdminDep,
    servicio: CategoriaServiceDep,
):
    try:
        return servicio.actualizar(categoria_id, datos)
    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    except NombreDuplicado as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(
    categoria_id: int,
    _admin: AdminDep,
    servicio: CategoriaServiceDep,
):
    try:
        servicio.eliminar(categoria_id)
    except CategoriaNoEncontrada as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
