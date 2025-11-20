# Panel de Administración - Guía de Uso

## ✅ Integración Completa

El panel de administración ha sido integrado exitosamente en el backend. Todos los cambios necesarios han sido aplicados a `app.py`.

## 🚀 Cómo Empezar

### 1. Instalar Dependencias (si no lo has hecho)

```bash
cd backend
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configurar Variables de Entorno

Crea o actualiza el archivo `backend/.env`:

```env
DATABASE_URL=postgresql://encuestas_user:tu_password@localhost/encuestas_db
FLASK_ENV=production
SECRET_KEY=tu_clave_secreta_generada_con_openssl

# Configuración de la elección
ELECTION_YEAR=2024
ELECTION_TITLE=Elecciones Presidenciales Chile
ELECTION_TYPE=Presidenciales
```

**Generar SECRET_KEY seguro:**
```bash
openssl rand -hex 32
```

### 3. Inicializar Base de Datos

```bash
# Iniciar el backend
python app.py

# En otra terminal, inicializar la BD
curl -X POST http://localhost:5000/api/init-db
```

### 4. Crear Usuario Administrador

```bash
# Ejecutar el script de creación de admin
python create_admin.py
```

El script te pedirá:
- Username
- Email
- Password

**Nota:** El password será hasheado con bcrypt automáticamente.

## 🔐 Autenticación

### Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "tu_password"
  }'
```

Respuesta exitosa:
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### Verificar Autenticación

```bash
curl http://localhost:5000/api/admin/check-auth \
  -H "Cookie: session=tu_session_cookie"
```

## 📊 Endpoints Disponibles

### Configuración General

**Obtener configuración:**
```bash
curl http://localhost:5000/api/admin/config \
  -H "Cookie: session=tu_session_cookie"
```

**Actualizar configuración:**
```bash
curl -X PUT http://localhost:5000/api/admin/config \
  -H "Content-Type: application/json" \
  -H "Cookie: session=tu_session_cookie" \
  -d '{
    "election_year": "2025",
    "election_title": "Elecciones Municipales Chile",
    "election_type": "Municipales",
    "site_name": "Portal Electoral 2025",
    "maintenance_mode": false
  }'
```

### Gestión de Candidatos

**Listar candidatos:**
```bash
curl http://localhost:5000/api/admin/candidatos \
  -H "Cookie: session=tu_session_cookie"
```

**Crear candidato:**
```bash
curl -X POST http://localhost:5000/api/admin/candidatos \
  -H "Content-Type: application/json" \
  -H "Cookie: session=tu_session_cookie" \
  -d '{
    "nombre": "María González",
    "partido": "Partido Verde",
    "foto_url": "/images/maria.jpg",
    "biografia": "Activista ambiental y economista",
    "programa": {
      "Economía": "Economía circular y sostenible",
      "Medio Ambiente": "100% energías renovables para 2030"
    },
    "linea_tiempo": [
      {"año": 2015, "evento": "Fundadora ONG EcoChile"},
      {"año": 2020, "evento": "Asesora Ministerio Medio Ambiente"}
    ]
  }'
```

**Actualizar candidato:**
```bash
curl -X PUT http://localhost:5000/api/admin/candidatos/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: session=tu_session_cookie" \
  -d '{
    "biografia": "Nueva biografía actualizada"
  }'
```

**Eliminar candidato:**
```bash
curl -X DELETE http://localhost:5000/api/admin/candidatos/1 \
  -H "Cookie: session=tu_session_cookie"
```

### Gestión de Preguntas del Quiz

**Crear pregunta:**
```bash
curl -X POST http://localhost:5000/api/admin/preguntas \
  -H "Content-Type: application/json" \
  -H "Cookie: session=tu_session_cookie" \
  -d '{
    "texto": "¿Apoyas la descentralización del gobierno?",
    "categoria": "Democracia",
    "orden": 9
  }'
```

**Asignar respuesta de candidato a pregunta:**
```bash
curl -X POST http://localhost:5000/api/admin/respuestas \
  -H "Content-Type: application/json" \
  -H "Cookie: session=tu_session_cookie" \
  -d '{
    "pregunta_id": 9,
    "candidato_id": 1,
    "posicion": 4
  }'
```

**Posiciones:** 1 = Muy en desacuerdo, 5 = Muy de acuerdo

### Estadísticas

**Obtener estadísticas:**
```bash
curl http://localhost:5000/api/admin/stats \
  -H "Cookie: session=tu_session_cookie"
```

Respuesta:
```json
{
  "total_candidatos": 2,
  "total_preguntas": 8,
  "total_votos": 150,
  "total_noticias": 45,
  "votos_por_candidato": [
    {"candidato": "José Antonio Kast", "votos": 75},
    {"candidato": "Gabriel Boric", "votos": 75}
  ]
}
```

### Utilidades

**Reiniciar votos:**
```bash
curl -X POST http://localhost:5000/api/admin/reset-votes \
  -H "Cookie: session=tu_session_cookie"
```

**Eliminar noticias:**
```bash
curl -X POST http://localhost:5000/api/admin/reset-news \
  -H "Cookie: session=tu_session_cookie"
```

## 🧪 Probar la Integración

Ejecuta el script de pruebas:

```bash
# Dale permisos de ejecución
chmod +x test_integration.sh

# Ejecuta las pruebas
./test_integration.sh
```

O en Windows:
```bash
bash test_integration.sh
```

## 🔧 Troubleshooting

### Error: "No autenticado"

Asegúrate de incluir la cookie de sesión en las peticiones:
- En curl: `-H "Cookie: session=tu_session_cookie"`
- En Postman/Insomnia: Habilitar cookies automáticamente

### Error: "Usuario no encontrado"

Crea un usuario admin con:
```bash
python create_admin.py
```

### Error: "SECRET_KEY no configurado"

Agrega SECRET_KEY al archivo `.env`:
```env
SECRET_KEY=tu_clave_secreta_de_32_caracteres
```

### Error de conexión a PostgreSQL

Verifica:
1. PostgreSQL está corriendo: `sudo systemctl status postgresql`
2. La base de datos existe: `sudo -u postgres psql -l`
3. El usuario tiene permisos: `sudo -u postgres psql -d encuestas_db`

## 📱 Frontend del Panel Admin

Para crear un frontend React del panel admin, consulta:
- [PANEL-ADMIN-INSTALACION.md](PANEL-ADMIN-INSTALACION.md)

El frontend debe conectarse a los endpoints `/api/admin/*` con las credenciales del administrador.

## 🔒 Seguridad en Producción

1. **SECRET_KEY:** Usa una clave fuerte generada con `openssl rand -hex 32`
2. **HTTPS:** Instala certificado SSL con Let's Encrypt
3. **CORS:** Configura CORS solo para dominios autorizados
4. **Rate Limiting:** Implementa límite de intentos de login
5. **Passwords:** Usa contraseñas fuertes (mínimo 12 caracteres)

## 📚 Recursos Adicionales

- [README.md](README.md) - Guía general del proyecto
- [PERSONALIZACION.md](PERSONALIZACION.md) - Personalizar la aplicación
- [PANEL-ADMIN-INSTALACION.md](PANEL-ADMIN-INSTALACION.md) - Frontend del admin panel

---

**¡Panel de Administración Listo para Usar! 🎉**
