# Guía de Personalización

Esta guía te ayudará a personalizar la aplicación para diferentes elecciones.

## Cambiar el Año y Tipo de Elección

### 1. Configuración del Backend

Edita el archivo `backend/.env`:

```bash
# Configuración de la elección
ELECTION_YEAR=2025
ELECTION_TITLE=Elecciones Presidenciales Chile
ELECTION_TYPE=Presidenciales
```

**Opciones disponibles:**

- `ELECTION_YEAR`: El año de la elección (ej: 2024, 2025, 2026, etc.)
- `ELECTION_TITLE`: Título de la elección (ej: "Elecciones Presidenciales Chile", "Elecciones Parlamentarias", etc.)
- `ELECTION_TYPE`: Tipo de elección (ej: "Presidenciales", "Parlamentarias", "Municipales", etc.)

### 2. Reiniciar el Backend

Después de cambiar la configuración:

```bash
# En desarrollo local
# Reinicia el servidor Flask

# En producción (VPS)
sudo systemctl restart encuestas
```

### 3. Verificar los Cambios

El año y título se actualizarán automáticamente en:
- Navbar (título superior)
- Página de inicio (hero section)
- Todas las páginas que lo utilicen

## Personalizar Candidatos

### 1. Editar backend/app.py

Busca la función `init_db()` y modifica los datos de los candidatos:

```python
candidato1 = Candidato(
    nombre="Nombre del Candidato 1",
    partido="Partido Político 1",
    foto_url="/images/candidato1.jpg",
    biografia="Biografía completa del candidato...",
    programa={
        "Economía": "Propuesta económica...",
        "Seguridad": "Propuesta de seguridad...",
        "Educación": "Propuesta educativa...",
        "Salud": "Propuesta de salud..."
    },
    linea_tiempo=[
        {"año": 2000, "evento": "Primer evento importante"},
        {"año": 2010, "evento": "Segundo evento importante"},
        {"año": 2020, "evento": "Tercer evento importante"}
    ]
)

candidato2 = Candidato(
    nombre="Nombre del Candidato 2",
    partido="Partido Político 2",
    # ... resto de la configuración
)
```

### 2. Personalizar Preguntas del Quiz

En la misma función `init_db()`, modifica las preguntas:

```python
preguntas_quiz = [
    {"texto": "Tu pregunta aquí", "categoria": "Economía", "orden": 1},
    {"texto": "Otra pregunta", "categoria": "Seguridad", "orden": 2},
    # ... más preguntas
]
```

### 3. Configurar Respuestas de Candidatos

Ajusta las respuestas de cada candidato (escala 1-5):
- 1 = Muy en desacuerdo
- 2 = En desacuerdo
- 3 = Neutral
- 4 = De acuerdo
- 5 = Muy de acuerdo

```python
respuestas_candidato1 = [5, 4, 3, 2, 1, 5, 4, 3]  # Una por cada pregunta
respuestas_candidato2 = [1, 2, 3, 4, 5, 1, 2, 3]
```

### 4. Reinicializar la Base de Datos

```bash
# Esto borrará todos los votos existentes
curl -X POST http://localhost:5000/api/init-db

# O desde tu navegador:
# http://tudominio.cl/api/init-db (método POST)
```

## Personalizar Colores y Diseño

### 1. Colores Principales

Edita `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Azul principal
    600: '#0284c7',
    // ... más tonos
  },
  secondary: {
    500: '#ec4899',  // Rosa/Púrpura secundario
    600: '#db2777',
    // ... más tonos
  }
}
```

### 2. Gradientes

Los gradientes están definidos en los componentes. Búscalos con:

```bash
grep -r "gradient-to-r" frontend/src/
```

Ejemplo de cambio:
```jsx
// Antes
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Después (por ejemplo, verde a azul)
className="bg-gradient-to-r from-green-600 to-blue-600"
```

## Agregar Más Candidatos

La aplicación actualmente soporta 2 candidatos. Para agregar más:

### 1. Backend

Agrega más candidatos en `init_db()`:

```python
candidato3 = Candidato(
    nombre="Tercer Candidato",
    # ... configuración
)

db.session.add_all([candidato1, candidato2, candidato3])
```

### 2. Frontend

Los componentes están diseñados para adaptarse automáticamente a más candidatos mediante `.map()`. Sin embargo, algunos estilos visuales (colores específicos) pueden necesitar ajustes.

## Cambiar Número de Preguntas del Quiz

Simplemente agrega o quita preguntas en el array `preguntas_quiz` y ajusta las respuestas de los candidatos para que coincidan con el número de preguntas.

```python
# Si agregas la pregunta 9:
preguntas_quiz = [
    # ... preguntas existentes (1-8)
    {"texto": "Nueva pregunta 9", "categoria": "Categoría", "orden": 9},
]

# Actualiza las respuestas (ahora 9 valores en lugar de 8):
respuestas_candidato1 = [5, 4, 3, 2, 1, 5, 4, 3, 4]  # 9 valores
respuestas_candidato2 = [1, 2, 3, 4, 5, 1, 2, 3, 2]  # 9 valores
```

## Personalizar Textos

### 1. Página de Inicio

Edita `frontend/src/pages/Home.jsx`:

```jsx
<p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
  Tu texto personalizado aquí
</p>
```

### 2. Descripciones de Features

En el mismo archivo, busca el array `features`:

```javascript
const features = [
  {
    title: 'Tu Título',
    description: 'Tu descripción',
    // ...
  }
]
```

## Configurar para Diferentes Tipos de Elecciones

### Elecciones Parlamentarias

```bash
# .env
ELECTION_YEAR=2025
ELECTION_TITLE=Elecciones Parlamentarias Chile
ELECTION_TYPE=Parlamentarias
```

Luego personaliza:
- Cambia "candidatos" por "listas" o "partidos" en los textos
- Ajusta las preguntas del quiz según temas parlamentarios
- Modifica las categorías de programas (ej: "Legislación", "Fiscalización")

### Elecciones Municipales

```bash
# .env
ELECTION_YEAR=2024
ELECTION_TITLE=Elecciones Municipales
ELECTION_TYPE=Municipales
```

Personaliza:
- Cambia textos a contexto local
- Ajusta categorías (ej: "Gestión Local", "Obras Públicas", "Servicios Municipales")
- Modifica biografías según contexto municipal

## Backup Antes de Personalizar

Siempre haz backup antes de cambios importantes:

```bash
# Backup de la base de datos
sudo -u postgres pg_dump encuestas_db > backup_$(date +%Y%m%d).sql

# Backup de archivos
cp backend/app.py backend/app.py.backup
cp backend/.env backend/.env.backup
```

## Restaurar Backup

```bash
# Restaurar base de datos
sudo -u postgres psql encuestas_db < backup_20240101.sql

# Restaurar archivos
cp backend/app.py.backup backend/app.py
```

## Testing Después de Personalizar

Verifica que todo funcione:

1. **Backend**
   ```bash
   curl http://localhost:5000/api/config
   curl http://localhost:5000/api/candidatos
   ```

2. **Frontend**
   - Navega por todas las páginas
   - Completa el quiz
   - Emite un voto de prueba
   - Verifica los resultados

3. **Logs**
   ```bash
   sudo journalctl -u encuestas -f
   ```

## Ejemplos de Personalización Rápida

### Cambiar de 2024 a 2025

```bash
# 1. Editar .env
nano backend/.env
# Cambiar ELECTION_YEAR=2024 a ELECTION_YEAR=2025

# 2. Reiniciar
sudo systemctl restart encuestas
```

### Cambiar Candidatos (mantener año)

```bash
# 1. Editar app.py
nano backend/app.py
# Modificar nombres, partidos, programas en init_db()

# 2. Reinicializar BD
curl -X POST http://localhost:5000/api/init-db

# 3. Reiniciar
sudo systemctl restart encuestas
```

---

¿Necesitas más personalización? Consulta el README.md principal o crea un issue en GitHub.
