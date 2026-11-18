"""Endpoints de pedidos."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import (
    CambioEstado,
    EstadoPedido,
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedidos,
)
from app.modules.pedidos.service import (
    PedidoAjeno,
    PedidoNoEncontrado,
    PedidoService,
    ProductoNoDisponible,
    ProductoNoEncontrado,
    ProductoRepetido,
    StockInsuficiente,
    TransicionInvalida,
)
from app.modules.pedidos.unit_of_work import (
    PedidoUnitOfWork,
    get_pedido_uow,
)
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/api/v1/pedidos", tags=["pedidos"])


def get_pedido_service(
    uow: Annotated[PedidoUnitOfWork, Depends(get_pedido_uow)],
) -> PedidoService:
    # El Router no abre el UoW; lo hace el Service.
    return PedidoService(uow)


PedidoServiceDep = Annotated[PedidoService, Depends(get_pedido_service)]
SesionDep = Annotated[UserPublic, Depends(get_current_active_user)]
AdminDep = Annotated[UserPublic, Depends(require_role(["admin"]))]


@router.post(
    "",
    response_model=PedidoRead,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    datos: PedidoCreate,
    usuario_actual: SesionDep,
    servicio: PedidoServiceDep,
):
    # 404 si el producto no existe o está inactivo; 400 si falla una regla de stock.
    try:
        # El usuario sale de la cookie, no del body.
        return servicio.crear(datos, usuario_actual.id)
    except ProductoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    except (
        ProductoNoDisponible,
        StockInsuficiente,
        ProductoRepetido,
    ) as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get("", response_model=PedidosPaginados)
def listar_pedidos(
    usuario_actual: SesionDep,
    servicio: PedidoServiceDep,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    estado: EstadoPedido | None = Query(default=None),
):
    # El admin ve todos; el cliente solo sus propios pedidos.
    return servicio.listar(
        usuario_id=usuario_actual.id,
        es_admin=usuario_actual.role == "admin",
        skip=skip,
        limit=limit,
        # El Service filtra por string, no por Enum.
        estado=estado.value if estado else None,
    )


# /resumen va antes de /{pedido_id}: si no, "resumen" se toma como id.
@router.get("/resumen", response_model=ResumenPedidos)
def resumen_pedidos(
    _admin: AdminDep,
    servicio: PedidoServiceDep,
):
    return servicio.resumen()


@router.get("/{pedido_id}", response_model=PedidoRead)
def obtener_pedido(
    pedido_id: int,
    usuario_actual: SesionDep,
    servicio: PedidoServiceDep,
):
    # El Service decide si es el cliente que hizo el pedido o un admin.
    try:
        return servicio.obtener_por_id(
            pedido_id,
            usuario_actual.id,
            usuario_actual.role == "admin",
        )
    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    except PedidoAjeno as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(error),
        )


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def cambiar_estado_pedido(
    pedido_id: int,
    datos: CambioEstado,
    _admin: AdminDep,
    servicio: PedidoServiceDep,
):
    # Solo el admin cambia el estado; el cliente usa /cancelar.
    try:
        return servicio.cambiar_estado(pedido_id, datos.estado)
    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    except TransicionInvalida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.patch("/{pedido_id}/cancelar", response_model=PedidoRead)
def cancelar_pedido(
    pedido_id: int,
    usuario_actual: SesionDep,
    servicio: PedidoServiceDep,
):
    # El cliente que hizo el pedido también puede cancelar; por eso no va require_role.
    try:
        return servicio.cancelar(pedido_id, usuario_actual.id)
    except PedidoNoEncontrado as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )
    except PedidoAjeno as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(error),
        )
    except TransicionInvalida as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )
