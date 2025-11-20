# Checklist de Despliegue

Usa esta lista para verificar que todo esté configurado correctamente.

## Pre-Despliegue

- [ ] VPS con Ubuntu 22.04 lista
- [ ] Acceso SSH configurado
- [ ] Dominio comprado y configurado
- [ ] DNS apuntando a la IP del VPS (esperar 24-48h para propagación)

## Configuración Inicial

- [ ] Archivos subidos a `/var/www/encuestas`
- [ ] Variables configuradas en `deployment/install.sh`:
  - [ ] `DOMAIN` cambiado a tu dominio real
  - [ ] `DB_PASSWORD` cambiado a contraseña segura
  - [ ] `DB_USER` verificado (opcional)

## Instalación

- [ ] Script de instalación ejecutado: `sudo bash deployment/install.sh`
- [ ] Sin errores durante la instalación
- [ ] PostgreSQL instalado y funcionando
- [ ] Nginx instalado y funcionando
- [ ] Node.js y npm instalados
- [ ] Python 3 y pip instalados

## Backend

- [ ] Entorno virtual creado en `/var/www/encuestas/backend/venv`
- [ ] Dependencias instaladas (`requirements.txt`)
- [ ] Archivo `.env` creado con credenciales correctas
- [ ] Servicio systemd configurado
- [ ] Servicio iniciado: `sudo systemctl status encuestas`
- [ ] Sin errores en logs: `sudo journalctl -u encuestas -n 50`
- [ ] Puerto 5000 escuchando: `sudo netstat -tlnp | grep 5000`

## Base de Datos

- [ ] PostgreSQL corriendo: `sudo systemctl status postgresql`
- [ ] Base de datos `encuestas_db` creada
- [ ] Usuario `encuestas_user` creado con permisos
- [ ] Base de datos inicializada: `curl -X POST http://localhost:5000/api/init-db`
- [ ] Respuesta exitosa del endpoint de inicialización

## Frontend

- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado con `REACT_APP_API_URL`
- [ ] Build ejecutado: `npm run build`
- [ ] Carpeta `build/` generada con archivos estáticos
- [ ] Archivos copiados a ubicación correcta

## Nginx

- [ ] Configuración copiada a `/etc/nginx/sites-available/encuestas`
- [ ] Dominio actualizado en la configuración
- [ ] Symlink creado en `/etc/nginx/sites-enabled/`
- [ ] Configuración válida: `sudo nginx -t`
- [ ] Nginx reiniciado: `sudo systemctl restart nginx`
- [ ] Puerto 80 escuchando: `sudo netstat -tlnp | grep :80`

## Firewall

- [ ] UFW habilitado
- [ ] Puerto 80 (HTTP) abierto
- [ ] Puerto 443 (HTTPS) abierto
- [ ] Puerto 22 (SSH) abierto
- [ ] Estado verificado: `sudo ufw status`

## Pruebas de Funcionamiento

- [ ] Health check responde: `curl http://localhost:5000/api/health`
- [ ] API candidatos responde: `curl http://localhost:5000/api/candidatos`
- [ ] Sitio web carga desde el navegador: `http://tu-dominio.cl`
- [ ] Todas las páginas cargan:
  - [ ] Home (/)
  - [ ] Comparador (/comparar)
  - [ ] Quiz (/quiz)
  - [ ] Línea de Tiempo (/linea-tiempo)
  - [ ] Votación (/votar)
  - [ ] Resultados (/resultados)
- [ ] Votación funciona correctamente
- [ ] Resultados se muestran correctamente
- [ ] Gráficos se visualizan correctamente

## SSL/HTTPS (Opcional pero Recomendado)

- [ ] Certbot instalado: `sudo apt install certbot python3-certbot-nginx`
- [ ] Certificado obtenido: `sudo certbot --nginx -d tudominio.cl`
- [ ] HTTPS funciona: `https://tudominio.cl`
- [ ] Redirección HTTP → HTTPS configurada
- [ ] Renovación automática verificada: `sudo certbot renew --dry-run`

## Seguridad

- [ ] Contraseña de base de datos es segura (no la predeterminada)
- [ ] `SECRET_KEY` en `.env` es única y segura
- [ ] Archivo `.env` tiene permisos restrictivos: `chmod 600 .env`
- [ ] Usuario `www-data` es dueño de los archivos necesarios
- [ ] SSH configurado con autenticación por llave (opcional)
- [ ] Contraseña de root cambiada

## Monitoreo y Mantenimiento

- [ ] Logs del backend accesibles: `sudo journalctl -u encuestas -f`
- [ ] Logs de Nginx accesibles: `sudo tail -f /var/log/nginx/encuestas_access.log`
- [ ] Script de comandos útiles probado: `bash deployment/comandos-utiles.sh`
- [ ] Backup de base de datos creado
- [ ] Plan de backups configurado (opcional)

## Personalización

- [ ] Nombres de candidatos actualizados (si es necesario)
- [ ] Programas de gobierno actualizados
- [ ] Líneas de tiempo actualizadas
- [ ] Preguntas del quiz revisadas
- [ ] Colores y diseño personalizados (opcional)

## Post-Despliegue

- [ ] Enviar prueba de voto
- [ ] Verificar que el voto se registre
- [ ] Ver resultados actualizados
- [ ] Probar quiz completo
- [ ] Verificar comparador de candidatos
- [ ] Revisar línea de tiempo
- [ ] Probar desde diferentes dispositivos:
  - [ ] Desktop
  - [ ] Mobile
  - [ ] Tablet
- [ ] Probar desde diferentes navegadores:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

## Optimización (Opcional)

- [ ] Compresión gzip habilitada en Nginx
- [ ] Cache de archivos estáticos configurado
- [ ] CDN configurado (opcional)
- [ ] Monitoreo con Prometheus/Grafana (opcional)
- [ ] Alertas configuradas (opcional)

## Documentación

- [ ] README.md revisado
- [ ] QUICKSTART.md revisado
- [ ] Credenciales guardadas en lugar seguro
- [ ] IPs y dominios documentados
- [ ] Procedimiento de actualización documentado

## Validación Final

- [ ] Sistema funcionando 100%
- [ ] Sin errores en logs
- [ ] Rendimiento aceptable (tiempo de carga < 3s)
- [ ] Todos los endpoints responden correctamente
- [ ] Base de datos persistiendo datos correctamente

---

## Comandos de Verificación Rápida

```bash
# Estado de todos los servicios
sudo systemctl status encuestas nginx postgresql

# Health checks
curl http://localhost:5000/api/health
curl http://localhost:5000/api/candidatos
curl http://localhost:5000/api/resultados

# Ver logs
sudo journalctl -u encuestas -n 20
sudo tail -20 /var/log/nginx/encuestas_error.log

# Verificar puertos
sudo netstat -tlnp | grep -E ':(80|443|5000|5432)'

# Espacio en disco
df -h

# Memoria y CPU
htop
```

## En Caso de Problemas

1. Revisa los logs: `sudo journalctl -u encuestas -n 100`
2. Verifica la configuración de Nginx: `sudo nginx -t`
3. Revisa la conexión a PostgreSQL: `sudo -u postgres psql -d encuestas_db`
4. Reinicia los servicios: `sudo systemctl restart encuestas nginx`
5. Consulta la sección de Troubleshooting en README.md

---

✅ Una vez completado este checklist, tu aplicación estará lista para producción.
