"""Consultas propias del módulo de pedidos."""

from datetime import datetime, time, timezone

from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(DetallePedido, session)


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(Pedido, session)

    def get_by_id(self, entidad_id: int) -> Pedido | None:
        """Busca un pedido y carga sus líneas."""
        return self.session.exec(
            select(Pedido)
            .where(Pedido.id == entidad_id)
            .options(selectinload(Pedido.items))
        ).first()

    def list_by_usuario(
        self,
        usuario_id: int,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[list[Pedido], int]:
        """Lista los pedidos de un usuario, con paginación y filtro opcional."""
        condiciones = [Pedido.usuario_id == usuario_id]
        if estado:
            condiciones.append(Pedido.estado == estado)
        return self._listar(condiciones, skip, limit)

    def list_all(
        self,
        skip: int = 0,
        limit: int = 20,
        estado: str | None = None,
    ) -> tuple[list[Pedido], int]:
        """Lista todos los pedidos, con paginación y filtro opcional."""
        condiciones = []
        if estado:
            condiciones.append(Pedido.estado == estado)
        return self._listar(condiciones, skip, limit)

    def _listar(
        self,
        condiciones: list,
        skip: int,
        limit: int,
    ) -> tuple[list[Pedido], int]:
        """Aplica las condiciones comunes a cualquier listado de pedidos."""
        consulta_total = select(func.count()).select_from(Pedido)
        consulta_pedidos = (
            select(Pedido)
            .options(selectinload(Pedido.items))
            .order_by(Pedido.created_at.desc())
            .offset(skip)
            .limit(limit)
        )

        if condiciones:
            consulta_total = consulta_total.where(*condiciones)
            consulta_pedidos = consulta_pedidos.where(*condiciones)

        total = self.session.exec(consulta_total).one()
        pedidos = self.session.exec(consulta_pedidos).all()

        return list(pedidos), total

    def count_by_estado(self) -> dict[str, int]:
        """Cuenta los pedidos agrupados por estado."""
        filas = self.session.exec(
            select(Pedido.estado, func.count()).group_by(Pedido.estado)
        ).all()
        return {estado: cantidad for estado, cantidad in filas}

    def pedidos_hoy(self) -> int:
        """Cuenta los pedidos creados en el día local del servidor."""
        ahora_local = datetime.now().astimezone()
        inicio_local = datetime.combine(
            ahora_local.date(),
            time.min,
            tzinfo=ahora_local.tzinfo,
        )
        fin_local = datetime.combine(
            ahora_local.date(),
            time.max,
            tzinfo=ahora_local.tzinfo,
        )

        # created_at se guarda en UTC sin zona horaria.
        inicio_utc = inicio_local.astimezone(timezone.utc).replace(
            tzinfo=None
        )
        fin_utc = fin_local.astimezone(timezone.utc).replace(tzinfo=None)

        return self.session.exec(
            select(func.count())
            .select_from(Pedido)
            .where(
                Pedido.created_at >= inicio_utc,
                Pedido.created_at <= fin_utc,
            )
        ).one()

    def ingresos_entregados(self) -> float:
        """Suma el total de los pedidos entregados."""
        total = self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0.0)).where(
                Pedido.estado == "ENTREGADO"
            )
        ).one()
        return float(total)
