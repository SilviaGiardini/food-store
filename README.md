# Food Store

**Alumna:** Silvia Giardini  
**Materia:** Programación 4 — TUPaD  
**Repositorio:** https://github.com/SilviaGiardini/food-store  
**Video:** pendiente de publicación

Aplicación web para pedidos de comida. Los clientes se registran, recorren el catálogo, arman un carrito y confirman un pedido con dirección y forma de pago. Los administradores gestionan categorías, productos, stock, pedidos y usuarios.

## Funcionalidades

- Registro e inicio de sesión.
- Catálogo con búsqueda, filtro por categoría y paginación.
- Carrito persistido en el navegador.
- Checkout con dirección, forma de pago y notas.
- Consulta y cancelación de pedidos propios.
- Panel de administración con resumen, categorías, productos, pedidos y usuarios.

La sesión se maneja con JWT en una cookie HttpOnly.

## Tecnologías

- **Backend:** Python 3.13, FastAPI, SQLModel, PostgreSQL.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS.
- **Datos y formularios:** TanStack Query, TanStack Form y TanStack Table.
- **Estado global:** Zustand.
- **Cliente HTTP:** Axios.

## Estructura del proyecto

```text
food-store/
├── backend/
│   ├── app/
│   │   ├── core/          # Configuración, base, seguridad y Unit of Work
│   │   ├── db/            # Seed de datos iniciales
│   │   └── modules/       # auth, usuarios, categorias, productos y pedidos
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── features/      # auth, categorias, productos, usuarios y pedidos
│   │   ├── routes/        # AppRouter y ProtectedRoute
│   │   ├── shared/
│   │   │   ├── api/        # Axios y TanStack Query
│   │   │   ├── components/ # Estados, paginación, skeleton y toast
│   │   │   └── layout/     # Navbar y MainLayout
│   │   └── store/         # authStore y cartStore
│   ├── package.json
│   └── .env.example
└── README.md
```

El frontend está organizado por features y el backend por módulos de dominio.

## Requisitos

- Python 3.13
- PostgreSQL 15 o superior
- Node.js 20.19 o superior
- pnpm 9 o superior
- Git

## Puesta en marcha

> El backend tiene que estar corriendo antes de levantar el frontend.

### 1. Base de datos

Crear la base `foodstore_integrador`:

```bash
createdb foodstore_integrador
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Completar `backend/.env` con los datos de PostgreSQL y una clave secreta.

Para generar la clave:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Cargar los datos iniciales:

```bash
python -m app.db.seed
```

El seed crea el usuario administrador, las categorías y los productos. Se puede volver a ejecutar sin duplicar datos.

Levantar la API:

```bash
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`.

### 3. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

Abrir `http://localhost:5173`.

Para verificar la compilación:

```bash
pnpm build
```

## Variables de entorno

### Backend: `backend/.env`

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL. Ejemplo: `postgresql+psycopg2://usuario:password@localhost:5432/foodstore_integrador` |
| `SECRET_KEY` | Clave para firmar los tokens. Mínimo 32 caracteres |
| `ALGORITHM` | Algoritmo del token. Por defecto `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token en minutos |
| `FRONTEND_ORIGIN` | URL del frontend. Por defecto `http://localhost:5173` |

### Frontend: `frontend/.env`

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API. Por defecto `http://localhost:8000/api/v1` |

Los archivos `.env` no se suben al repositorio. Los ejemplos están en `backend/.env.example` y `frontend/.env.example`.

## Usuario administrador

```text
Usuario: admin
Contraseña: Admin1234!
```

Los usuarios nuevos se registran desde `/register`.

## Rutas principales

| Ruta | Acceso |
|---|---|
| `/` | Público |
| `/login` y `/register` | Público |
| `/carrito` | Público |
| `/checkout` | Sesión |
| `/mis-pedidos` | Sesión |
| `/admin/resumen` | Admin |
| `/admin/categorias` | Admin |
| `/admin/productos` | Admin |
| `/admin/pedidos` | Admin |
| `/admin/usuarios` | Admin |

## Documentación de la API

Con el backend corriendo:

- Documentación interactiva: `http://localhost:8000/docs`
- Documentación alternativa: `http://localhost:8000/redoc`
