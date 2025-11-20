#!/bin/bash

# Script de instalación para Ubuntu 22.04
# Ejecutar con: sudo bash install.sh

set -e

echo "====================================="
echo "Instalación de Encuestas Presidenciales"
echo "====================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables (CAMBIAR SEGÚN TU CONFIGURACIÓN)
DOMAIN="tudominio.cl"
DB_NAME="encuestas_db"
DB_USER="encuestas_user"
DB_PASSWORD="cambiar_password_seguro"
APP_DIR="/var/www/encuestas"

echo -e "${YELLOW}1. Actualizando sistema...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}2. Instalando dependencias del sistema (sin Node.js)...${NC}"
apt install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib git curl

echo -e "${YELLOW}3. Instalando Node.js 20.x desde NodeSource...${NC}"
# Desinstalar versiones conflictivas si existen
apt remove -y nodejs npm || true

# Instalar Node.js desde NodeSource (versión LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar instalación
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo -e "${YELLOW}4. Configurando PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

echo -e "${YELLOW}5. Creando directorio de la aplicación...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR

# Copiar archivos del proyecto aquí
# Asume que ya tienes los archivos en el servidor
# Si usas git: git clone tu-repositorio.git .

echo -e "${YELLOW}6. Configurando Backend (Python/Flask)...${NC}"
cd $APP_DIR/backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Crear archivo .env
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost/$DB_NAME
FLASK_ENV=production
SECRET_KEY=$(openssl rand -hex 32)

# Configuración de la elección
ELECTION_YEAR=2024
ELECTION_TITLE=Elecciones Presidenciales Chile
ELECTION_TYPE=Presidenciales
EOF

# Crear directorios para logs
mkdir -p /var/log/encuestas
chown www-data:www-data /var/log/encuestas

echo -e "${YELLOW}7. Inicializando base de datos...${NC}"
# Esto se hará posteriormente mediante la API /api/init-db

echo -e "${YELLOW}8. Configurando Frontend (React)...${NC}"
cd $APP_DIR/frontend

# Instalar dependencias de Node
npm install

# Crear archivo .env para el frontend
cat > .env << EOF
REACT_APP_API_URL=https://$DOMAIN/api
EOF

# Build del frontend
npm run build

echo -e "${YELLOW}9. Configurando Nginx...${NC}"
# Copiar configuración de nginx
cp $APP_DIR/deployment/nginx.conf /etc/nginx/sites-available/encuestas

# Modificar el dominio en la configuración
sed -i "s/tudominio.cl/$DOMAIN/g" /etc/nginx/sites-available/encuestas

# Habilitar el sitio
ln -sf /etc/nginx/sites-available/encuestas /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración
nginx -t

echo -e "${YELLOW}10. Configurando servicio systemd...${NC}"
cp $APP_DIR/deployment/encuestas.service /etc/systemd/system/

# Recargar systemd
systemctl daemon-reload

# Habilitar y iniciar el servicio
systemctl enable encuestas
systemctl start encuestas

# Reiniciar nginx
systemctl restart nginx

echo -e "${YELLOW}11. Configurando firewall...${NC}"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

echo -e "${GREEN}====================================="
echo "Instalación completada!"
echo "====================================="
echo ""
echo "Próximos pasos:"
echo "1. Configurar DNS para apuntar $DOMAIN a esta IP"
echo "2. Instalar certificado SSL con: sudo certbot --nginx -d $DOMAIN"
echo "3. Inicializar la base de datos: curl -X POST http://localhost:5000/api/init-db"
echo "4. Verificar el servicio: systemctl status encuestas"
echo "5. Ver logs: journalctl -u encuestas -f"
echo ""
echo -e "${GREEN}Tu aplicación debería estar disponible en: http://$DOMAIN${NC}"
