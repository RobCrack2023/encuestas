# Guía de Actualización en Producción

Esta guía te ayudará a actualizar tu aplicación en producción con los últimos cambios del panel de administración.

## 📋 Pre-requisitos

- Acceso SSH al servidor de producción
- Git configurado en el servidor
- Node.js y npm instalados (versión 18 o superior)
- Python 3.x y pip instalados
- PostgreSQL corriendo

## 🚀 Pasos de Actualización

### 1. Conectarse al Servidor

```bash
ssh usuario@tu-servidor.com
```

### 2. Navegar al Directorio del Proyecto

```bash
cd /ruta/a/tu/proyecto/encuestas
```

### 3. Hacer Backup (Recomendado)

```bash
# Backup de la base de datos
sudo -u postgres pg_dump encuestas_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup del código actual
tar -czf backup_codigo_$(date +%Y%m%d_%H%M%S).tar.gz .
```

### 4. Detener los Servicios

```bash
# Detener el backend (si usas systemd)
sudo systemctl stop encuestas-backend

# O si usas screen/tmux, detén el proceso manualmente
```

### 5. Actualizar el Código desde Git

```bash
# Verificar rama actual
git branch

# Obtener últimos cambios
git fetch origin

# Ver cambios que se van a aplicar
git log HEAD..origin/master --oneline

# Aplicar cambios
git pull origin master
```

### 6. Actualizar Backend

```bash
cd backend

# Activar entorno virtual
source venv/bin/activate  # En Linux/Mac
# O en Windows: venv\Scripts\activate

# Actualizar dependencias (si hubo cambios en requirements.txt)
pip install -r requirements.txt

# Volver al directorio raíz
cd ..
```

### 7. Actualizar Frontend

```bash
cd frontend

# Instalar/actualizar dependencias
npm install

# Configurar variable de entorno para producción
# Editar o crear el archivo .env
nano .env
```

Asegúrate de que el archivo `.env` contenga tu URL de producción:
```env
VITE_API_URL=https://tudominio.com
```

```bash
# Compilar para producción
npm run build

# Volver al directorio raíz
cd ..
```

### 8. Verificar Configuración

```bash
# Verificar que el archivo .env del backend tenga la configuración correcta
cat backend/.env

# Debe contener:
# - DATABASE_URL con la conexión a PostgreSQL
# - SECRET_KEY segura
# - Configuración de la elección
```

### 9. Aplicar Migraciones (si las hay)

```bash
cd backend
source venv/bin/activate

# Si hay migraciones de base de datos, aplicarlas
# (En este caso no hay migraciones nuevas, pero por si acaso)
python app.py  # Verificar que inicie sin errores
# Ctrl+C para detener

cd ..
```

### 10. Reiniciar los Servicios

```bash
# Si usas systemd
sudo systemctl start encuestas-backend
sudo systemctl status encuestas-backend

# Si usas nginx, recargar configuración
sudo systemctl reload nginx
```

### 11. Verificar que Todo Funcione

```bash
# Verificar que el backend responda
curl http://localhost:5000/api/health

# Verificar logs del backend
sudo journalctl -u encuestas-backend -n 50 -f

# Verificar logs de nginx
sudo tail -f /var/log/nginx/access.log
```

### 12. Probar el Panel de Administración

1. Abre tu navegador y ve a: `https://tudominio.com/admin/login`
2. Ingresa con tus credenciales de administrador
3. Verifica que:
   - Dashboard carga correctamente
   - Puedes ver candidatos
   - Puedes ver preguntas
   - La configuración se muestra

## 🔍 Verificación de Archivos Críticos

Asegúrate de que estos archivos existan en el servidor:

```bash
# Frontend compilado
ls -la frontend/dist/

# Debe contener:
# - index.html
# - assets/ (con archivos CSS y JS)

# Backend
ls -la backend/

# Debe contener:
# - app.py
# - admin_routes.py
# - models.py
# - create_admin.py
```

## 🛠️ Resolución de Problemas

### El frontend no carga

**Solución:**
```bash
cd frontend
rm -rf dist/
npm run build
sudo systemctl reload nginx
```

### Error "Network Error" en el panel admin

**Causa:** El backend no está corriendo o la URL del API es incorrecta.

**Solución:**
```bash
# Verificar que el backend esté corriendo
sudo systemctl status encuestas-backend

# Verificar la URL en frontend/.env
cat frontend/.env

# Debe ser: VITE_API_URL=https://tudominio.com
```

### Error de autenticación en el panel

**Solución:**
```bash
# Crear nuevo usuario admin si es necesario
cd backend
source venv/bin/activate
python create_admin.py
```

### Los cambios del frontend no se ven

**Causa:** Cache del navegador o nginx.

**Solución:**
```bash
# Limpiar cache de nginx
sudo systemctl reload nginx

# En el navegador: Ctrl+Shift+R (hard refresh)
```

## 📊 Verificación Post-Actualización

Marca cada item cuando lo verifiques:

- [ ] Backend responde en `/api/health`
- [ ] Login del admin funciona en `/admin/login`
- [ ] Dashboard muestra estadísticas correctas
- [ ] Se pueden crear/editar/eliminar candidatos
- [ ] Se pueden crear/editar/eliminar preguntas
- [ ] La configuración se puede actualizar
- [ ] El sitio público funciona correctamente
- [ ] No hay errores en los logs de nginx
- [ ] No hay errores en los logs del backend

## 🔄 Rollback (en caso de problemas)

Si algo sale mal, puedes volver a la versión anterior:

```bash
# Detener servicios
sudo systemctl stop encuestas-backend

# Restaurar código
git reset --hard HEAD~1

# Restaurar base de datos (si hiciste backup)
sudo -u postgres psql encuestas_db < backup_YYYYMMDD_HHMMSS.sql

# Reinstalar dependencias anteriores
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

cd frontend
npm install
npm run build
cd ..

# Reiniciar servicios
sudo systemctl start encuestas-backend
sudo systemctl reload nginx
```

## 📝 Notas Importantes

1. **Siempre haz backup antes de actualizar**
2. **Prueba primero en un entorno de desarrollo/staging**
3. **Actualiza en horarios de bajo tráfico**
4. **Mantén los logs abiertos durante la actualización**
5. **Verifica que todos los servicios se reinicien correctamente**

## 🆘 Soporte

Si tienes problemas durante la actualización:

1. Revisa los logs: `sudo journalctl -u encuestas-backend -n 100`
2. Verifica la configuración de nginx: `sudo nginx -t`
3. Consulta los archivos de documentación:
   - `README.md`
   - `TROUBLESHOOTING-NODEJS.md`
   - `ADMIN-FRONTEND-README.md`

---

**¡Actualización Completada! 🎉**

Fecha de esta guía: $(date +%Y-%m-%d)
