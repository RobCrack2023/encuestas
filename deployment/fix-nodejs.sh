#!/bin/bash

# Script para solucionar problemas de Node.js en Ubuntu 22.04
# Ejecutar con: sudo bash fix-nodejs.sh

set -e

echo "================================================"
echo "Solucionando problemas de Node.js/npm"
echo "================================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}1. Eliminando versiones conflictivas de Node.js/npm...${NC}"
apt remove -y nodejs npm 2>/dev/null || true
apt autoremove -y
apt clean

echo -e "${YELLOW}2. Limpiando paquetes rotos...${NC}"
apt --fix-broken install -y

echo -e "${YELLOW}3. Instalando Node.js 20.x desde NodeSource (repositorio oficial)...${NC}"
# Descargar e instalar el script de configuración de NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

echo -e "${YELLOW}4. Instalando Node.js (incluye npm)...${NC}"
apt install -y nodejs

echo -e "${YELLOW}5. Verificando instalación...${NC}"
echo ""
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

echo -e "${GREEN}✓ Node.js instalado correctamente${NC}"
echo "  Node version: $NODE_VERSION"
echo "  NPM version: $NPM_VERSION"
echo ""

echo -e "${GREEN}================================================"
echo "¡Instalación completada exitosamente!"
echo "================================================${NC}"
echo ""
echo "Ahora puedes continuar con la instalación de la aplicación:"
echo "  cd /var/www/encuestas/frontend"
echo "  npm install"
echo "  npm run build"
