# Guía Rápida de Inicio

Esta guía te ayudará a tener tu aplicación funcionando en 10 minutos.

## Requisitos Previos

- VPS con Ubuntu 22.04
- Acceso root o sudo
- Dominio apuntando a tu IP (opcional pero recomendado)

## Pasos Rápidos

### 1. Subir archivos al servidor

```bash
# Opción A: Con Git
ssh tu-usuario@tu-ip
cd /var/www
sudo git clone https://github.com/tu-usuario/encuestas.git

# Opción B: Con SCP desde tu máquina local
scp -r ./encuestas tu-usuario@tu-ip:/tmp/
ssh tu-usuario@tu-ip
sudo mv /tmp/encuestas /var/www/
```

### 2. Configurar variables

```bash
cd /var/www/encuestas
sudo nano deployment/install.sh
```

Cambia estas líneas:
```bash
DOMAIN="tudominio.cl"          # Tu dominio real
DB_PASSWORD="cambiar_aqui"     # Contraseña segura
```

### 3. Ejecutar instalación automática

```bash
sudo bash deployment/install.sh
```

El script instalará TODO automáticamente (toma 5-10 minutos).

### 4. Inicializar base de datos

```bash
curl -X POST http://localhost:5000/api/init-db
```

### 5. Verificar que funciona

```bash
# Ver estado del backend
sudo systemctl status encuestas

# Ver logs
sudo journalctl -u encuestas -f
```

Abre tu navegador en: `http://tu-dominio.cl`

### 6. (Opcional) Configurar HTTPS

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tudominio.cl -d www.tudominio.cl
```

## ¿Problemas?

### El servicio no inicia

```bash
# Ver qué pasó
sudo journalctl -u encuestas -n 50

# Verificar la base de datos
sudo -u postgres psql -d encuestas_db
```

### Nginx muestra error 502

```bash
# Verificar que el backend esté corriendo
sudo systemctl status encuestas

# Reiniciar todo
sudo systemctl restart encuestas
sudo systemctl restart nginx
```

### No puedo acceder desde el navegador

```bash
# Verificar firewall
sudo ufw status

# Si está bloqueado, permitir tráfico web
sudo ufw allow 'Nginx Full'
```

## Comandos Útiles

Usa el menú interactivo:

```bash
cd /var/www/encuestas
sudo bash deployment/comandos-utiles.sh
```

O comandos directos:

```bash
# Ver logs en tiempo real
sudo journalctl -u encuestas -f

# Reiniciar backend
sudo systemctl restart encuestas

# Reiniciar Nginx
sudo systemctl restart nginx

# Actualizar aplicación
cd /var/www/encuestas
git pull
sudo systemctl restart encuestas
cd frontend && npm run build
```

## Cambiar Año de Elección

```bash
sudo nano /var/www/encuestas/backend/.env
```

Modifica estas líneas:

```bash
ELECTION_YEAR=2025
ELECTION_TITLE=Elecciones Presidenciales Chile
ELECTION_TYPE=Presidenciales
```

Reinicia:

```bash
sudo systemctl restart encuestas
```

El año se actualiza automáticamente en toda la app.

## Personalizar Candidatos

```bash
sudo nano /var/www/encuestas/backend/app.py
```

Busca la función `init_db()` y modifica:
- Nombres
- Partidos
- Programas
- Línea de tiempo

Luego reinicializa:

```bash
curl -X POST http://localhost:5000/api/init-db
sudo systemctl restart encuestas
```

**💡 Guía completa**: Ver [PERSONALIZACION.md](PERSONALIZACION.md)

## URLs Importantes

- **Aplicación**: https://tudominio.cl
- **API Health**: https://tudominio.cl/api/health
- **Resultados**: https://tudominio.cl/api/resultados

## Estructura del Proyecto

```
encuestas/
├── backend/              # Flask API
│   ├── app.py           # Aplicación principal
│   ├── requirements.txt # Dependencias Python
│   └── .env            # Variables de entorno
├── frontend/            # React App
│   ├── src/            # Código fuente
│   └── package.json    # Dependencias Node
├── deployment/          # Archivos de configuración
│   ├── nginx.conf      # Configuración Nginx
│   ├── encuestas.service  # Servicio systemd
│   └── install.sh      # Script de instalación
└── README.md           # Documentación completa
```

## Seguridad Básica

```bash
# Cambiar contraseña de root
sudo passwd

# Configurar autenticación por llave SSH
ssh-copy-id tu-usuario@tu-ip

# Deshabilitar login por contraseña en SSH
sudo nano /etc/ssh/sshd_config
# Cambiar: PasswordAuthentication no
sudo systemctl restart sshd

# Configurar firewall
sudo ufw enable
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
```

## Monitoreo

```bash
# CPU y memoria
htop

# Espacio en disco
df -h

# Procesos Python
ps aux | grep python

# Logs de errores
sudo tail -f /var/log/nginx/encuestas_error.log
```

## Respaldo (Backup)

```bash
# Backup de la base de datos
sudo -u postgres pg_dump encuestas_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
sudo -u postgres psql encuestas_db < backup_20240101.sql
```

---

¿Necesitas ayuda? Revisa el README.md completo o crea un issue en GitHub.
