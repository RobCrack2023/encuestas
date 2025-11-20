# Solución de Problemas: Node.js en Ubuntu 22.04

## Problema: Conflictos de Dependencias de Node.js/npm

Si ves este error:

```
The following packages have unmet dependencies:
 nodejs : Conflicts: npm
 npm : Depends: node-cacache but it is not going to be installed
       Depends: node-gyp but it is not going to be installed
       ...
E: Unable to correct problems, you have held broken packages.
```

### Causa

Los repositorios de Ubuntu 22.04 tienen versiones conflictivas de Node.js y npm que causan problemas de dependencias. La solución es usar **NodeSource**, el repositorio oficial de Node.js.

## Solución Rápida (Opción 1: Script Automático)

Usa el script de solución incluido:

```bash
cd /var/www/encuestas/deployment
sudo bash fix-nodejs.sh
```

Este script:
1. ✅ Elimina versiones conflictivas
2. ✅ Limpia paquetes rotos
3. ✅ Instala Node.js 20 LTS desde NodeSource
4. ✅ Verifica la instalación

**Tiempo estimado**: 2-3 minutos

## Solución Manual (Opción 2: Paso a Paso)

### 1. Eliminar versiones conflictivas

```bash
sudo apt remove -y nodejs npm
sudo apt autoremove -y
sudo apt clean
```

### 2. Limpiar paquetes rotos

```bash
sudo apt --fix-broken install -y
```

### 3. Instalar Node.js desde NodeSource

```bash
# Agregar repositorio de NodeSource (Node.js 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -

# Instalar Node.js (incluye npm automáticamente)
sudo apt install -y nodejs
```

### 4. Verificar instalación

```bash
node --version
# Debería mostrar: v20.x.x

npm --version
# Debería mostrar: 10.x.x
```

## Después de Solucionar

Una vez instalado Node.js correctamente:

### Si estás en instalación inicial:

```bash
# Continuar con el script de instalación
cd /var/www/encuestas
sudo bash deployment/install.sh
```

### Si ya tenías la app instalada:

```bash
# Instalar dependencias del frontend
cd /var/www/encuestas/frontend
npm install

# Build del frontend
npm run build

# Reiniciar Nginx
sudo systemctl reload nginx
```

## Versiones Recomendadas

- **Node.js**: 18.x o 20.x (LTS - Long Term Support)
- **NPM**: 9.x o 10.x (viene incluido con Node.js)

## Por Qué NodeSource

✅ **Ventajas de usar NodeSource**:
- Versiones actualizadas de Node.js
- Sin conflictos de dependencias
- Actualizaciones de seguridad
- Compatible con Ubuntu 22.04
- Incluye npm automáticamente
- Repositorio oficial mantenido por el equipo de Node.js

❌ **Problemas con repositorios de Ubuntu**:
- Versiones desactualizadas
- Conflictos entre nodejs y npm
- Dependencias rotas
- No recomendado para producción

## Alternativas

### Usar NVM (Node Version Manager)

Si prefieres más control sobre las versiones:

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recargar shell
source ~/.bashrc

# Instalar Node.js 20
nvm install 20

# Usar Node.js 20
nvm use 20

# Hacer Node.js 20 la versión por defecto
nvm alias default 20
```

**Nota**: Con NVM necesitas configurar permisos adicionales para que funcione con systemd.

## Verificación Final

Después de instalar, verifica que todo funciona:

```bash
# 1. Verificar Node.js
node --version

# 2. Verificar npm
npm --version

# 3. Verificar que puedes instalar paquetes
npm install -g npm@latest

# 4. Test de instalación de paquete
cd /tmp
mkdir test-npm
cd test-npm
npm init -y
npm install express
echo "✅ npm funciona correctamente"
cd ..
rm -rf test-npm
```

## Problemas Comunes Adicionales

### Error: "npm command not found"

```bash
# Reinstalar Node.js
sudo apt install --reinstall nodejs
```

### Error: Permisos al ejecutar npm

```bash
# Dar permisos al directorio npm global
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/lib/node_modules
```

### Error: EACCES al instalar paquetes globalmente

Opción 1 (Recomendada): No usar sudo
```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
```

Opción 2: Usar sudo (menos seguro)
```bash
sudo npm install -g nombre-paquete
```

## Soporte

Si sigues teniendo problemas:

1. **Verifica logs**:
   ```bash
   npm config get registry
   npm cache clean --force
   ```

2. **Revisa versión de Ubuntu**:
   ```bash
   lsb_release -a
   ```

3. **Verifica conectividad**:
   ```bash
   curl -I https://registry.npmjs.org/
   ```

4. **Crea un issue en GitHub** con:
   - Output de `node --version`
   - Output de `npm --version`
   - Output de `cat /etc/os-release`
   - Mensaje de error completo

---

## Resumen Rápido

```bash
# SOLUCIÓN EN 3 COMANDOS:
sudo apt remove -y nodejs npm && sudo apt autoremove -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Verificar:
node --version && npm --version
```

✅ **Listo para usar**
