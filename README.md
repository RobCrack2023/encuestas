# Sistema de Encuestas Presidenciales Chile 2024

Sistema web interactivo para realizar encuestas presidenciales con comparación de candidatos, quiz de afinidad política, línea de tiempo y visualización de resultados en tiempo real.

## Características

- **Comparador de Candidatos**: Visualiza y compara propuestas lado a lado
- **Quiz de Afinidad**: 8 preguntas para descubrir tu afinidad con cada candidato
- **Línea de Tiempo**: Conoce la trayectoria política de cada candidato
- **Sistema de Votación**: Participa en la encuesta con control de duplicados
- **Resultados en Tiempo Real**: Gráficos interactivos con actualización automática
- **Diseño Atractivo**: Interfaz moderna con animaciones fluidas

## Tecnologías

### Backend
- Python 3.10+
- Flask (API REST)
- PostgreSQL (Base de datos)
- SQLAlchemy (ORM)
- Gunicorn (WSGI Server)

### Frontend
- React 18
- Vite (Build tool)
- Tailwind CSS (Estilos)
- Framer Motion (Animaciones)
- Chart.js (Gráficos)
- Axios (HTTP client)

### Infraestructura
- Nginx (Reverse proxy)
- Ubuntu 22.04 LTS
- Systemd (Service management)

## Instalación en VPS Ubuntu 22.04

### Opción 1: Script Automático (Recomendado)

1. **Clonar o subir el proyecto a tu VPS**

```bash
cd /var/www
sudo git clone tu-repositorio.git encuestas
# O sube los archivos mediante SFTP/SCP
```

2. **Configurar variables en el script**

Edita `deployment/install.sh` y modifica:
- `DOMAIN`: Tu dominio (ej: encuestas.tudominio.cl)
- `DB_PASSWORD`: Contraseña segura para PostgreSQL

3. **Ejecutar el script de instalación**

```bash
cd /var/www/encuestas
sudo bash deployment/install.sh
```

4. **Inicializar la base de datos**

```bash
curl -X POST http://localhost:5000/api/init-db
```

5. **Configurar SSL (Opcional pero recomendado)**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.cl -d www.tudominio.cl
```

### Opción 2: Instalación Manual

#### 1. Preparar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv nginx postgresql postgresql-contrib nodejs npm git curl -y
```

#### 2. Configurar PostgreSQL

```bash
sudo -u postgres psql

-- Dentro de PostgreSQL:
CREATE DATABASE encuestas_db;
CREATE USER encuestas_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE encuestas_db TO encuestas_user;
\c encuestas_db
GRANT ALL ON SCHEMA public TO encuestas_user;
\q
```

#### 3. Configurar Backend

```bash
cd /var/www/encuestas/backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env
nano .env
```

Edita `.env` con tus credenciales:
```
DATABASE_URL=postgresql://encuestas_user:tu_password@localhost/encuestas_db
FLASK_ENV=production
SECRET_KEY=tu_clave_secreta_generada
```

Para generar una clave secreta:
```bash
openssl rand -hex 32
```

#### 4. Configurar Frontend

```bash
cd /var/www/encuestas/frontend

# Instalar dependencias
npm install

# Crear .env
echo "REACT_APP_API_URL=https://tudominio.cl/api" > .env

# Build
npm run build
```

#### 5. Configurar Nginx

```bash
sudo cp deployment/nginx.conf /etc/nginx/sites-available/encuestas

# Editar dominio
sudo nano /etc/nginx/sites-available/encuestas
# Cambiar 'tudominio.cl' por tu dominio real

# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/encuestas /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 6. Configurar Servicio Systemd

```bash
sudo cp deployment/encuestas.service /etc/systemd/system/

# Crear directorio de logs
sudo mkdir -p /var/log/encuestas
sudo chown www-data:www-data /var/log/encuestas

# Habilitar e iniciar servicio
sudo systemctl daemon-reload
sudo systemctl enable encuestas
sudo systemctl start encuestas

# Verificar estado
sudo systemctl status encuestas
```

#### 7. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

#### 8. Inicializar Base de Datos

```bash
curl -X POST http://localhost:5000/api/init-db
```

#### 9. Configurar DNS

Apunta tu dominio a la IP de tu VPS:
- Tipo A: `@` → IP de tu VPS
- Tipo A: `www` → IP de tu VPS

#### 10. Instalar Certificado SSL

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.cl -d www.tudominio.cl
```

Certbot configurará automáticamente HTTPS y renovación automática.

## Desarrollo Local

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# Crear .env local
echo "DATABASE_URL=postgresql://user:pass@localhost/encuestas_db" > .env

# Ejecutar
python app.py
```

El backend estará en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará en `http://localhost:3000`

## API Endpoints

### Candidatos
- `GET /api/candidatos` - Lista todos los candidatos
- `GET /api/candidatos/:id` - Obtiene un candidato específico

### Votación
- `POST /api/votar` - Registra un voto
- `GET /api/resultados` - Obtiene resultados de la encuesta

### Quiz
- `GET /api/quiz/preguntas` - Obtiene preguntas del quiz
- `POST /api/quiz/calcular` - Calcula afinidad política

### Comparación
- `GET /api/comparar` - Compara programas de candidatos

### Utilidades
- `GET /api/health` - Health check
- `POST /api/init-db` - Inicializa base de datos con datos de ejemplo

## Comandos Útiles

### Ver logs del backend
```bash
sudo journalctl -u encuestas -f
```

### Reiniciar servicios
```bash
sudo systemctl restart encuestas
sudo systemctl restart nginx
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/encuestas_access.log
sudo tail -f /var/log/nginx/encuestas_error.log
```

### Actualizar la aplicación
```bash
cd /var/www/encuestas

# Actualizar código
git pull  # Si usas git

# Actualizar backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart encuestas

# Actualizar frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

## Personalización

### Modificar candidatos

Edita `backend/app.py` en la función `init_db()` para cambiar:
- Nombres de candidatos
- Partidos políticos
- Programas y propuestas
- Línea de tiempo
- Respuestas del quiz

Luego reinicializa la base de datos:
```bash
curl -X POST http://localhost:5000/api/init-db
```

### Modificar diseño

Los estilos principales están en:
- `frontend/src/index.css` - Estilos globales
- `frontend/tailwind.config.js` - Configuración de Tailwind
- Cada componente tiene sus propios estilos en línea

### Agregar más preguntas al quiz

Edita el array `preguntas_quiz` en `backend/app.py` y agrega las respuestas correspondientes para cada candidato.

## Troubleshooting

### El backend no inicia
```bash
# Ver logs detallados
sudo journalctl -u encuestas -n 50

# Verificar permisos
sudo chown -R www-data:www-data /var/www/encuestas

# Verificar .env
cat /var/www/encuestas/backend/.env
```

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Probar conexión manual
sudo -u postgres psql -d encuestas_db
```

### Nginx muestra 502 Bad Gateway
```bash
# Verificar que el backend esté corriendo
sudo systemctl status encuestas

# Verificar que Gunicorn escuche en el puerto correcto
sudo netstat -tlnp | grep 5000
```

### El frontend no carga
```bash
# Verificar que el build existe
ls -la /var/www/encuestas/frontend/build

# Reconstruir frontend
cd /var/www/encuestas/frontend
npm run build
```

## Seguridad

- Cambia las credenciales por defecto en `.env`
- Usa HTTPS (Let's Encrypt)
- Mantén el sistema actualizado
- Configura firewall correctamente
- Usa contraseñas fuertes para PostgreSQL
- Limita acceso SSH (solo por clave pública)

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Soporte

Para reportar problemas o solicitar características, crea un issue en el repositorio.

---

Desarrollado con ❤️ para las Elecciones Chile 2024
