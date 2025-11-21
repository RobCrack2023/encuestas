# Panel de Administración - Frontend

Panel de administración completo desarrollado en React para gestionar el sistema de encuestas electorales.

## ✨ Características

- **Autenticación Segura:** Sistema de login con sesiones
- **Dashboard Interactivo:** Estadísticas en tiempo real con gráficos
- **Gestión de Candidatos:** CRUD completo con modal de edición
- **Gestión de Preguntas:** Administración del quiz político
- **Configuración del Sitio:** Personalización de parámetros generales
- **Diseño Responsive:** Funciona en desktop, tablet y móvil
- **Sidebar Colapsable:** Navegación optimizada
- **Animaciones Fluidas:** Experiencia de usuario mejorada con Framer Motion

## 🏗️ Arquitectura

```
frontend/src/
├── contexts/
│   └── AuthContext.jsx         # Contexto de autenticación global
├── services/
│   └── adminApi.js            # Cliente API para endpoints del admin
├── components/
│   └── admin/
│       ├── AdminLayout.jsx    # Layout principal con sidebar
│       └── ProtectedRoute.jsx # Protección de rutas privadas
├── pages/
│   └── admin/
│       ├── Login.jsx          # Página de inicio de sesión
│       ├── Dashboard.jsx      # Dashboard con estadísticas
│       ├── Candidatos.jsx     # Gestión de candidatos
│       ├── Preguntas.jsx      # Gestión de preguntas
│       └── Configuracion.jsx  # Configuración del sistema
└── App.jsx                     # Router principal con rutas
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Para producción, usa tu dominio:
```env
VITE_API_URL=https://tudominio.cl
```

### 3. Iniciar en Desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 4. Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en `frontend/dist/`

## 🔐 Autenticación

### Flujo de Autenticación

1. Usuario accede a `/admin/login`
2. Ingresa credenciales (username y password)
3. El sistema envía las credenciales al backend
4. Si son correctas, se crea una sesión con cookie
5. Usuario es redirigido a `/admin/dashboard`
6. Las rutas `/admin/*` están protegidas por `ProtectedRoute`

### AuthContext

El contexto de autenticación provee:

```javascript
const { user, loading, login, logout, isAuthenticated } = useAuth();
```

- `user`: Objeto con datos del usuario actual
- `loading`: Boolean indicando si está verificando autenticación
- `login(username, password)`: Función para iniciar sesión
- `logout()`: Función para cerrar sesión
- `isAuthenticated`: Boolean indicando si está autenticado

## 📱 Páginas del Admin

### Dashboard (`/admin/dashboard`)

- Tarjetas con estadísticas (candidatos, preguntas, votos, noticias)
- Gráfico de barras con distribución de votos
- Accesos rápidos a las principales funciones

### Candidatos (`/admin/candidatos`)

**Funcionalidades:**
- Listar todos los candidatos en cards
- Crear nuevo candidato con modal
- Editar candidato existente
- Eliminar candidato (con confirmación)
- Campos: nombre, partido, foto_url, biografía, programa, línea_tiempo

### Preguntas (`/admin/preguntas`)

**Funcionalidades:**
- Listar preguntas en tabla
- Crear nueva pregunta
- Editar pregunta existente
- Eliminar pregunta (con confirmación)
- Ordenar preguntas
- Categorías predefinidas

### Configuración (`/admin/configuracion`)

**Funcionalidades:**
- Editar año de elección
- Editar tipo de elección
- Editar título de elección
- Editar nombre del sitio
- Activar/desactivar modo mantenimiento
- **Zona de peligro:**
  - Reiniciar todos los votos
  - Eliminar todas las noticias

## 🎨 Diseño y UX

### Tecnologías Utilizadas

- **React 18:** Framework principal
- **Vite:** Build tool rápido
- **Tailwind CSS:** Estilos utility-first
- **Framer Motion:** Animaciones fluidas
- **Chart.js:** Gráficos interactivos
- **React Icons:** Iconos consistentes
- **React Router Dom:** Navegación

### Paleta de Colores

- **Primario:** Azul (`#2563eb`)
- **Éxito:** Verde (`#10b981`)
- **Peligro:** Rojo (`#ef4444`)
- **Neutral:** Grises (`#f3f4f6` a `#1f2937`)

### Componentes Reutilizables

- **Sidebar:** Navegación lateral colapsable
- **Modal:** Ventanas emergentes para formularios
- **Cards:** Tarjetas para mostrar información
- **Tablas:** Listados de datos estructurados
- **Botones:** Estilos consistentes con hover y estados

## 🔧 Desarrollo

### Agregar Nueva Página Admin

1. Crear archivo en `src/pages/admin/`:

```jsx
import { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';

const MiPagina = () => {
  // Tu código aquí
  return <div>Mi Página</div>;
};

export default MiPagina;
```

2. Agregar ruta en `App.jsx`:

```jsx
import MiPagina from './pages/admin/MiPagina';

// En las rutas admin:
<Route path="mi-pagina" element={<MiPagina />} />
```

3. Agregar enlace en `AdminLayout.jsx`:

```jsx
const menuItems = [
  // ... otras rutas
  { path: '/admin/mi-pagina', icon: FiIcon, label: 'Mi Página' }
];
```

### Agregar Nuevo Endpoint API

En `src/services/adminApi.js`:

```javascript
const adminApi = {
  // ... endpoints existentes
  miNuevoEndpoint: () => axios.get(`${API_URL}/api/admin/mi-endpoint`),
};
```

## 📦 Build y Despliegue

### Build Local

```bash
npm run build
```

### Despliegue en VPS

1. Build del proyecto:
```bash
cd frontend
npm run build
```

2. Copiar archivos al servidor:
```bash
scp -r dist/* usuario@tuservidor:/var/www/encuestas/frontend/dist/
```

3. Nginx servirá los archivos estáticos desde `/var/www/encuestas/frontend/dist/`

### Variables de Entorno en Producción

Asegúrate de configurar la URL del API correctamente:

```env
VITE_API_URL=https://tudominio.cl
```

## 🧪 Testing

### Probar Localmente

1. Backend corriendo en `http://localhost:5000`
2. Frontend corriendo en `http://localhost:5173`
3. Accede a `http://localhost:5173/admin/login`
4. Credenciales por defecto:
   - **Usuario:** admin
   - **Password:** admin123

### Verificar Funcionalidades

- [ ] Login con credenciales correctas
- [ ] Protección de rutas (intentar acceder sin login)
- [ ] Dashboard muestra estadísticas
- [ ] Crear, editar y eliminar candidatos
- [ ] Crear, editar y eliminar preguntas
- [ ] Actualizar configuración
- [ ] Logout correctamente

## 🐛 Troubleshooting

### Error: "Network Error"

**Causa:** El backend no está corriendo o la URL es incorrecta.

**Solución:**
- Verifica que el backend esté en `http://localhost:5000`
- Revisa el archivo `.env` con `VITE_API_URL`
- Verifica que CORS esté habilitado en el backend

### Error: "Not authenticated"

**Causa:** La sesión expiró o no hay cookies.

**Solución:**
- Cierra sesión y vuelve a iniciar
- Verifica que `axios.defaults.withCredentials = true` esté configurado
- Verifica que el backend envíe las cookies correctamente

### Modal no se muestra

**Causa:** Z-index o estilos CSS conflictivos.

**Solución:**
- Verifica que el modal tenga `z-50` en Tailwind
- Revisa la consola del navegador por errores
- Asegúrate de que Framer Motion esté instalado

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Chart.js](https://www.chartjs.org/docs/latest/)
- [React Router](https://reactrouter.com/en/main)

## 🤝 Contribuir

Para agregar nuevas funcionalidades al panel admin:

1. Crea un nuevo componente en `pages/admin/`
2. Agrega el endpoint correspondiente en `services/adminApi.js`
3. Registra la ruta en `App.jsx`
4. Actualiza el sidebar en `AdminLayout.jsx`
5. Prueba todas las funcionalidades

---

**Panel Admin desarrollado con ❤️ para Encuestas Chile 2024**
