"""
Carga inicial de datos: admin, categorías y productos.
"""

from sqlmodel import Session, select

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.modules.categorias.model import Categoria
from app.modules.productos.model import Producto
from app.modules.usuarios.model import Usuario

# Pedido y DetallePedido se importan para que SQLModel resuelva las relaciones.
from app.modules.pedidos.models import DetallePedido, Pedido 

ADMIN = {
    "username": "admin",
    "full_name": "Administrador",
    "email": "admin@foodstore.com",
    "password": "Admin1234!",
    "role": "admin",
}

CATEGORIAS = [
    {
        "nombre": "Pizzas",
        "descripcion": "Pizzas artesanales al horno de barro.",
    },
    {
        "nombre": "Hamburguesas",
        "descripcion": "Hamburguesas con medallón casero y pan brioche.",
    },
    {
        "nombre": "Bebidas",
        "descripcion": "Bebidas frías, aguas y limonadas.",
    },
]

PRODUCTOS = [
    {
        "nombre": "Muzzarella",
        "categoria": "Pizzas",
        "descripcion": "Salsa de tomate, mozzarella y orégano.",
        "precio_base": 8000.0,
        "stock": 10,
    },
    {
        "nombre": "Napolitana",
        "categoria": "Pizzas",
        "descripcion": "Salsa de tomate, mozzarella, tomate y ajo.",
        "precio_base": 8500.0,
        "stock": 8,
    },
    {
        "nombre": "Fugazzeta",
        "categoria": "Pizzas",
        "descripcion": "Cebolla, mozzarella y un toque de orégano.",
        "precio_base": 9000.0,
        "stock": 6,
    },
    {
        "nombre": "Hamburguesa clásica",
        "categoria": "Hamburguesas",
        "descripcion": "Medallón de carne, lechuga, tomate y mayonesa.",
        "precio_base": 7000.0,
        "stock": 12,
    },
    {
        "nombre": "Hamburguesa doble cheddar",
        "categoria": "Hamburguesas",
        "descripcion": "Dos medallones y cheddar fundido.",
        "precio_base": 9500.0,
        "stock": 10,
    },
    {
        "nombre": "Hamburguesa veggie",
        "categoria": "Hamburguesas",
        "descripcion": "Medallón de garbanzo, palta y tomate.",
        "precio_base": 7500.0,
        "stock": 7,
    },
    {
        "nombre": "Coca-Cola 500 ml",
        "categoria": "Bebidas",
        "descripcion": "Gaseosa fría.",
        "precio_base": 2500.0,
        "stock": 20,
    },
    {
        "nombre": "Agua mineral 500 ml",
        "categoria": "Bebidas",
        "descripcion": "Agua sin gas.",
        "precio_base": 1800.0,
        "stock": 15,
    },
    {
        "nombre": "Limonada",
        "categoria": "Bebidas",
        "descripcion": "Limón exprimido, menta y hielo.",
        "precio_base": 3000.0,
        "stock": 9,
    },
]


def crear_admin(session: Session) -> None:
    existente = session.exec(
        select(Usuario).where(Usuario.username == ADMIN["username"])
    ).first()

    if existente:
        print(f"  [=] Admin ya existe: {ADMIN['username']}")
        return

    session.add(
        Usuario(
            username=ADMIN["username"],
            full_name=ADMIN["full_name"],
            email=ADMIN["email"],
            hashed_password=hash_password(ADMIN["password"]),
            role=ADMIN["role"],
        )
    )
    session.commit()
    print(f"  [+] Admin creado: {ADMIN['username']} / {ADMIN['password']}")


def crear_categorias(session: Session) -> dict[str, Categoria]:
    categorias: dict[str, Categoria] = {}

    for datos in CATEGORIAS:
        existente = session.exec(
            select(Categoria).where(Categoria.nombre == datos["nombre"])
        ).first()

        if existente:
            categorias[datos["nombre"]] = existente
            print(f"  [=] Categoría ya existe: {datos['nombre']}")
            continue

        categoria = Categoria(**datos)
        session.add(categoria)
        session.commit()
        session.refresh(categoria)
        categorias[datos["nombre"]] = categoria
        print(f"  [+] Categoría creada: {categoria.nombre}")

    return categorias


def crear_productos(
    session: Session,
    categorias: dict[str, Categoria],
) -> None:
    for datos in PRODUCTOS:
        existente = session.exec(
            select(Producto).where(Producto.nombre == datos["nombre"])
        ).first()

        if existente:
            print(f"  [=] Producto ya existe: {datos['nombre']}")
            continue

        categoria = categorias[datos["categoria"]]
        producto = Producto(
            categoria_id=categoria.id,
            nombre=datos["nombre"],
            descripcion=datos["descripcion"],
            precio_base=datos["precio_base"],
            stock=datos["stock"],
            disponible=True,
            activo=True,
        )
        session.add(producto)
        session.commit()
        print(f"  [+] Producto creado: {producto.nombre} (stock {producto.stock})")


def run() -> None:
    print(" Seed de Food Store ")
    create_all_tables()

    with Session(engine) as session:
        crear_admin(session)
        categorias = crear_categorias(session)
        crear_productos(session, categorias)

    print("\nUsuario admin: admin / Admin1234!")


if __name__ == "__main__":
    run()
