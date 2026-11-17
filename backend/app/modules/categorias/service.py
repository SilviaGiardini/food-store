"""Reglas de negocio de categorías."""

from app.modules.categorias.model import Categoria
from app.modules.categorias.schemas import (
    CategoriaCreate,
    CategoriaRead,
    CategoriaUpdate,
)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    def __init__(self, categoria_id: int):
        self.categoria_id = categoria_id
        super().__init__(f"Categoría con id {categoria_id} no encontrada")


class NombreDuplicado(Exception):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"Ya existe una categoría con el nombre '{nombre}'")


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    def listar_activas(self) -> list[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.get_activas()
            return [
                CategoriaRead.model_validate(categoria)
                for categoria in categorias
            ]

    def obtener_por_id(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada(categoria_id)
            return CategoriaRead.model_validate(categoria)

    def crear(self, datos: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            if uow.categorias.get_by_nombre(datos.nombre):
                raise NombreDuplicado(datos.nombre)

            categoria = Categoria(
                nombre=datos.nombre,
                descripcion=datos.descripcion,
            )
            categoria_guardada = uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria_guardada)

    def actualizar(
        self,
        categoria_id: int,
        datos: CategoriaUpdate,
    ) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada(categoria_id)

            cambios = datos.model_dump(exclude_unset=True)

            if "nombre" in cambios and cambios["nombre"] != categoria.nombre:
                if uow.categorias.exists_nombre_excluding(
                    cambios["nombre"],
                    categoria_id,
                ):
                    raise NombreDuplicado(cambios["nombre"])

            for campo, valor in cambios.items():
                setattr(categoria, campo, valor)

            categoria_actualizada = uow.categorias.update(categoria)
            return CategoriaRead.model_validate(categoria_actualizada)

    def eliminar(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if categoria is None or not categoria.activo:
                raise CategoriaNoEncontrada(categoria_id)

            categoria.activo = False
            uow.categorias.update(categoria)
