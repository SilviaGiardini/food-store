"""Reglas de negocio de productos."""

from app.modules.productos.model import Producto
from app.modules.productos.schemas import (
    ProductoCreate,
    ProductoRead,
    ProductoStockUpdate,
    ProductosPaginados,
    ProductoUpdate,
)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(f"Producto con id {producto_id} no encontrado")


class CategoriaNoEncontrada(Exception):
    def __init__(self, categoria_id: int):
        self.categoria_id = categoria_id
        super().__init__(f"Categoría con id {categoria_id} no encontrada")


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    def listar(
        self,
        skip: int,
        limit: int,
        search: str | None,
        categoria_id: int | None,
        disponible: bool | None,
    ) -> ProductosPaginados:
        with self.uow as uow:
            productos, total = uow.productos.search(
                skip=skip,
                limit=limit,
                search=search,
                categoria_id=categoria_id,
                disponible=disponible,
            )
            items = [
                ProductoRead.model_validate(producto)
                for producto in productos
            ]
            return ProductosPaginados(total=total, items=items)

    def obtener_por_id(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado(producto_id)
            return ProductoRead.model_validate(producto)

    def crear(self, datos: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(datos.categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada(datos.categoria_id)

            producto = Producto(
                categoria_id=datos.categoria_id,
                nombre=datos.nombre,
                descripcion=datos.descripcion,
                precio_base=datos.precio_base,
                imagen_url=datos.imagen_url,
                stock=datos.stock,
                disponible=datos.disponible,
                categoria=categoria,
            )
            producto_guardado = uow.productos.add(producto)
            return ProductoRead.model_validate(producto_guardado)

    def actualizar(
        self,
        producto_id: int,
        datos: ProductoUpdate,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado(producto_id)

            cambios = datos.model_dump(exclude_unset=True)

            if "categoria_id" in cambios:
                categoria = uow.categorias.get_by_id(cambios["categoria_id"])
                if categoria is None or not categoria.activo:
                    raise CategoriaNoEncontrada(cambios["categoria_id"])
                producto.categoria = categoria

            for campo, valor in cambios.items():
                setattr(producto, campo, valor)

            producto_actualizado = uow.productos.update(producto)
            return ProductoRead.model_validate(producto_actualizado)

    def actualizar_stock(
        self,
        producto_id: int,
        datos: ProductoStockUpdate,
    ) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado(producto_id)

            producto.stock = datos.stock
            producto.disponible = datos.disponible

            producto_actualizado = uow.productos.update(producto)
            return ProductoRead.model_validate(producto_actualizado)

    def eliminar(self, producto_id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if producto is None or not producto.activo:
                raise ProductoNoEncontrado(producto_id)

            producto.activo = False
            uow.productos.update(producto)
