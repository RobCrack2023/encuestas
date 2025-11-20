# 🎛️ Panel de Administración - Guía de Instalación

## 📋 Resumen

He creado un **sistema completo de administración** para tu aplicación de encuestas. Con este panel podrás gestionar TODO desde el navegador sin editar archivos manualmente.

## ✨ Características del Panel Admin

### 🔐 Autenticación
- Login seguro con usuario y contraseña
- Sesiones protegidas con Flask-Login
- Contraseñas hasheadas con bcrypt

### ⚙️ Configuración General
- Cambiar año de elección
- Modificar título de elección
- Cambiar tipo de elección
- Activar modo mantenimiento

### 👥 Gestión de Candidatos (CRUD Completo)
- ✅ Crear nuevos candidatos
- ✅ Editar candidatos existentes
- ✅ Eliminar candidatos
- ✅ Gestionar programas por categoría
- ✅ Editar línea de tiempo
- ✅ Cambiar foto y biografía

### ❓ Gestión de Preguntas del Quiz
- ✅ Crear preguntas
- ✅ Editar preguntas
- ✅ Eliminar preguntas
- ✅ Asignar categorías
- ✅ Configurar respuestas de cada candidato

### 📰 Gestión de Fuentes de Noticias
- ✅ Agregar fuentes personalizadas
- ✅ Configurar URLs o RSS
- ✅ Activar/desactivar fuentes
- ✅ Actualizar configuración

### 📊 Estadísticas
- Ver total de candidatos, preguntas, votos
- Ver distribución de votos por candidato
- Monitorear total de noticias

### 🔧 Utilidades
- Reiniciar todos los votos
- Limpiar base de datos de noticias
- Ver logs de actividad

---

## 🚀 Instalación en tu VPS

### Paso 1: Actualizar el código

```bash
cd /var/www/encuestas
git pull origin master
```

### Paso 2: Instalar nuevas dependencias

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

Esto instalará:
- `Flask-Login==0.6.3` (autenticación)
- `bcrypt==4.1.2` (hash de contraseñas)

### Paso 3: Actualizar app.py

Necesitas integrar el sistema admin en tu `app.py`. Agrega estas líneas:

**Al inicio del archivo** (después de los imports existentes):

```python
from flask_login import LoginManager
from models import db, Usuario, Configuracion, FuenteNoticia
from admin_routes import admin_bp
import bcrypt

# Configurar Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin.login'

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

# Registrar blueprint de admin
app.register_blueprint(admin_bp)
```

**Reemplazar** las líneas donde defines los modelos (Candidato, Voto, etc.) **POR**:

```python
# Los modelos ahora están en models.py
from models import Candidato, Voto, Pregunta, RespuestaCandidato, Noticia
```

**NOTA**: Para evitar errores, hay un archivo `app_integration_guide.txt` con instrucciones detalladas.

### Paso 4: Crear las tablas de la base de datos

```bash
cd /var/www/encuestas/backend
source venv/bin/activate
python create_admin.py
```

Esto creará:
- Las nuevas tablas (usuarios, configuracion, fuentes_noticias)
- El usuario administrador por defecto

**Credenciales por defecto**:
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANTE**: Cambia estas credenciales después del primer login.

### Paso 5: Reiniciar el backend

```bash
sudo systemctl restart encuestas
```

### Paso 6: Verificar que funciona

```bash
# Test del endpoint de login
curl -X POST http://localhost:5000/api/admin/check-auth

# Debería responder: {"authenticated": false}
```

---

## 🎨 Frontend del Panel Admin (Próximo paso)

El backend ya está listo. Para el frontend tengo dos opciones:

### Opción 1: Interfaz React Completa (Recomendada)
Crear un panel admin completo con React integrado en tu app actual.

### Opción 2: Herramienta Externa
Usar herramientas como Postman o Insomnia para hacer las llamadas API mientras desarrollo la interfaz.

### Opción 3: Panel Simple HTML
Crear páginas HTML simples con formularios para gestión básica.

---

## 📡 Endpoints API Disponibles

### Autenticación

```bash
# Login
POST /api/admin/login
Body: {"username": "admin", "password": "admin123"}

# Logout
POST /api/admin/logout

# Verificar auth
GET /api/admin/check-auth
```

### Configuración

```bash
# Obtener config
GET /api/admin/config

# Actualizar config
PUT /api/admin/config
Body: {
  "election_year": "2025",
  "election_title": "Elecciones Presidenciales Chile",
  "election_type": "Presidenciales"
}
```

### Candidatos

```bash
# Listar todos
GET /api/admin/candidatos

# Crear nuevo
POST /api/admin/candidatos
Body: {
  "nombre": "Nuevo Candidato",
  "partido": "Partido XYZ",
  "biografia": "...",
  "programa": {...},
  "linea_tiempo": [...]
}

# Actualizar
PUT /api/admin/candidatos/1
Body: {"nombre": "Nombre Actualizado", ...}

# Eliminar
DELETE /api/admin/candidatos/1
```

### Preguntas del Quiz

```bash
# Listar
GET /api/admin/preguntas

# Crear
POST /api/admin/preguntas
Body: {
  "texto": "Nueva pregunta?",
  "categoria": "Economía",
  "orden": 1
}

# Actualizar
PUT /api/admin/preguntas/1

# Eliminar
DELETE /api/admin/preguntas/1
```

### Fuentes de Noticias

```bash
# Listar
GET /api/admin/fuentes-noticias

# Crear
POST /api/admin/fuentes-noticias
Body: {
  "name": "Nuevo Medio",
  "source_id": "nuevo_medio",
  "rss": "https://ejemplo.cl/rss",
  "type": "rss",
  "is_active": true
}

# Actualizar
PUT /api/admin/fuentes-noticias/1

# Eliminar
DELETE /api/admin/fuentes-noticias/1
```

### Estadísticas

```bash
# Ver stats
GET /api/admin/stats
```

### Utilidades

```bash
# Reiniciar votos
POST /api/admin/reset-votes

# Limpiar noticias
POST /api/admin/reset-news
```

---

## 🧪 Prueba con cURL

### 1. Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

### 2. Ver configuración actual

```bash
curl -X GET http://localhost:5000/api/admin/config \
  -b cookies.txt
```

### 3. Cambiar el año a 2025

```bash
curl -X PUT http://localhost:5000/api/admin/config \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"election_year":"2025"}'
```

### 4. Ver candidatos

```bash
curl -X GET http://localhost:5000/api/admin/candidatos \
  -b cookies.txt
```

### 5. Crear un candidato

```bash
curl -X POST http://localhost:5000/api/admin/candidatos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nombre": "Test Candidato",
    "partido": "Partido Test",
    "biografia": "Biografía de prueba",
    "programa": {
      "Economía": "Propuesta económica",
      "Salud": "Propuesta de salud"
    },
    "linea_tiempo": [
      {"año": 2020, "evento": "Primer evento"}
    ]
  }'
```

---

## 🔒 Seguridad

### Cambiar Credenciales de Admin

```bash
cd /var/www/encuestas/backend
source venv/bin/activate

# Con variables de entorno
ADMIN_USERNAME=tu_usuario ADMIN_PASSWORD=tu_password_seguro python create_admin.py
```

### Configurar SECRET_KEY

En tu `.env`:

```bash
SECRET_KEY=tu_clave_secreta_muy_larga_y_aleatoria
```

Genera una:

```bash
openssl rand -hex 32
```

### Proteger con HTTPS

El panel admin **DEBE** usarse con HTTPS en producción:

```bash
sudo certbot --nginx -d tudominio.cl
```

---

## 🐛 Troubleshooting

### Error: "No module named 'models'"

```bash
cd /var/www/encuestas/backend
# Verifica que existe models.py
ls -la models.py
```

### Error: "No module named 'admin_routes'"

```bash
cd /var/www/encuestas/backend
# Verifica que existe admin_routes.py
ls -la admin_routes.py
```

### Error: "Table 'usuarios' doesn't exist"

```bash
cd /var/www/encuestas/backend
source venv/bin/activate
python create_admin.py
```

### No puedo hacer login

1. Verifica las credenciales
2. Verifica que las cookies estén habilitadas
3. Revisa los logs:

```bash
sudo journalctl -u encuestas -f
```

---

## 📝 Próximos Pasos

1. ✅ Backend admin completado
2. ⏳ Frontend admin en React (siguiente)
3. ⏳ Sistema de permisos por roles (futuro)
4. ⏳ Logs de auditoría (futuro)

---

## 🎯 Resumen Rápido

```bash
# 1. Actualizar
cd /var/www/encuestas && git pull

# 2. Dependencias
cd backend && source venv/bin/activate && pip install -r requirements.txt

# 3. Crear admin
python create_admin.py

# 4. Reiniciar
sudo systemctl restart encuestas

# 5. Probar
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

¿Necesitas ayuda con algún paso? ¿Quieres que continúe con la interfaz React del panel admin?
