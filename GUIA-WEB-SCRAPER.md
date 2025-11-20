# Guía del Web Scraper de Noticias

Sistema automático de recolección de noticias políticas y electorales desde múltiples fuentes de medios chilenos.

## 🎯 Características

- ✅ Scraping automático de noticias desde múltiples fuentes
- ✅ Soporte para RSS y scraping HTML
- ✅ Filtrado por palabras clave (elecciones, política, etc.)
- ✅ Almacenamiento en base de datos
- ✅ Detección de noticias duplicadas
- ✅ Interfaz visual atractiva en el frontend
- ✅ Actualización manual o automática

## 📰 Fuentes Configuradas

El sistema viene preconfigurado con:

1. **BioBío Chile** (RSS)
   - Feed de política

2. **T13** (RSS)
   - Noticias políticas

3. **Emol** (HTML Scraping)
   - Sección nacional

4. **La Tercera** (HTML Scraping)
   - Sección política

## 🚀 Uso Básico

### Desde la Interfaz Web

1. Ve a la sección **Noticias** en el menú
2. Haz clic en **"Actualizar Noticias"**
3. El sistema descargará automáticamente las últimas noticias
4. Filtra por fuente si deseas

### Desde la API

```bash
# Actualizar noticias manualmente
curl -X POST http://localhost:5000/api/noticias/actualizar

# Obtener noticias almacenadas
curl http://localhost:5000/api/noticias

# Obtener noticias de una fuente específica
curl http://localhost:5000/api/noticias?source=biobio

# Limitar número de resultados
curl http://localhost:5000/api/noticias?limit=10

# Obtener lista de fuentes
curl http://localhost:5000/api/noticias/fuentes
```

## ⚙️ Agregar Nuevas Fuentes

### Fuente RSS

Edita `backend/scraper/news_scraper.py` y agrega en `self.sources`:

```python
'nueva_fuente': {
    'name': 'Nombre del Medio',
    'rss': 'https://ejemplo.cl/feed/rss',
    'type': 'rss',
    'logo': '/images/logo.png'
}
```

### Fuente HTML

```python
'nueva_fuente': {
    'name': 'Nombre del Medio',
    'url': 'https://ejemplo.cl/politica',
    'type': 'html',
    'logo': '/images/logo.png'
}
```

**Nota**: El scraper HTML usa estrategias genéricas. Para sitios específicos, puede que necesites personalizar el método `_scrape_html()`.

## 🔄 Actualización Automática

### Opción 1: Cron Job (Recomendado para VPS)

Crea un cron job para ejecutar cada hora:

```bash
crontab -e
```

Agrega:

```bash
0 * * * * curl -X POST http://localhost:5000/api/noticias/actualizar
```

### Opción 2: APScheduler (Integrado en Flask)

Agrega al final de `backend/app.py` antes de `if __name__ == '__main__'`:

```python
from apscheduler.schedulers.background import BackgroundScheduler

def actualizar_noticias_automatico():
    with app.app_context():
        try:
            from scraper.news_scraper import get_political_news
            noticias_scraped = get_political_news(limit=50)

            for noticia_data in noticias_scraped:
                existente = Noticia.query.filter_by(url=noticia_data['url']).first()
                if not existente:
                    nueva_noticia = Noticia(**noticia_data)
                    db.session.add(nueva_noticia)

            db.session.commit()
            print("Noticias actualizadas automáticamente")
        except Exception as e:
            print(f"Error actualizando noticias: {str(e)}")

# Programar actualización cada hora
scheduler = BackgroundScheduler()
scheduler.add_job(func=actualizar_noticias_automatico, trigger="interval", hours=1)
scheduler.start()
```

## 🎨 Personalización

### Cambiar Palabras Clave de Filtrado

Edita `backend/scraper/news_scraper.py`, función `get_political_news()`:

```python
keywords = [
    'elecciones',
    'presidencial',
    'candidato',
    'tu_palabra_clave',
    # Agrega más...
]
```

### Modificar Límite de Noticias

En la interfaz web o vía API:

```javascript
// Frontend: src/pages/Noticias.jsx
const response = await axios.get('/api/noticias', {
  params: { limit: 50 }  // Cambiar aquí
})
```

### Agregar Fuentes Internacionales

```python
# En news_scraper.py
'bbc_mundo': {
    'name': 'BBC Mundo',
    'rss': 'https://www.bbc.com/mundo/topics/...',
    'type': 'rss',
    'logo': '/images/bbc-logo.png'
}
```

## 🛠️ Instalación en VPS

### 1. Instalar Dependencias

```bash
cd /var/www/encuestas/backend
source venv/bin/activate
pip install beautifulsoup4 requests feedparser APScheduler
```

O simplemente:

```bash
pip install -r requirements.txt
```

### 2. Actualizar Base de Datos

```bash
# Crear las tablas de noticias
curl -X POST http://localhost:5000/api/init-db
```

### 3. Primera Carga de Noticias

```bash
curl -X POST http://localhost:5000/api/noticias/actualizar
```

### 4. Verificar

```bash
curl http://localhost:5000/api/noticias
```

### 5. Build del Frontend

```bash
cd /var/www/encuestas/frontend
npm run build
sudo systemctl reload nginx
```

## 📊 Estructura de Datos

### Modelo de Noticia

```python
class Noticia:
    id: int
    title: str                  # Título de la noticia
    url: str                    # URL única de la noticia
    summary: str                # Resumen o extracto
    published_at: datetime      # Fecha de publicación
    source: str                 # Nombre del medio
    source_id: str              # ID de la fuente
    source_logo: str            # URL del logo
    image_url: str              # URL de la imagen
    created_at: datetime        # Cuándo se agregó a la BD
    is_active: bool             # Si está activa o no
```

## 🚨 Troubleshooting

### Error: "Module 'scraper' not found"

```bash
# Asegúrate de que existe __init__.py
touch backend/scraper/__init__.py
```

### Error: "No se pueden obtener noticias"

1. **Verifica conectividad**:
   ```bash
   curl https://www.biobiochile.cl
   ```

2. **Revisa logs del backend**:
   ```bash
   sudo journalctl -u encuestas -f
   ```

3. **Prueba el scraper directamente**:
   ```python
   cd backend
   source venv/bin/activate
   python
   >>> from scraper.news_scraper import get_political_news
   >>> news = get_political_news(limit=5)
   >>> print(news)
   ```

### Noticias Duplicadas

El sistema detecta duplicados por URL. Si ves duplicados:

```sql
-- Limpiar duplicados en PostgreSQL
DELETE FROM noticias
WHERE id NOT IN (
    SELECT MIN(id)
    FROM noticias
    GROUP BY url
);
```

### Scraper muy lento

Reduce el límite de noticias:

```python
# En news_scraper.py, método scrape_all()
news = self._scrape_html(source_id, source_config, limit)
# Cambia limit a un valor menor, ej: 10
```

## 📋 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/noticias` | Obtiene noticias almacenadas |
| GET | `/api/noticias?source=biobio` | Filtra por fuente |
| GET | `/api/noticias?limit=20` | Limita resultados |
| POST | `/api/noticias/actualizar` | Ejecuta el scraper |
| GET | `/api/noticias/fuentes` | Lista fuentes configuradas |

## 🔒 Consideraciones de Seguridad

1. **Rate Limiting**: Los sitios pueden bloquear IPs con demasiadas solicitudes
2. **Robots.txt**: Respeta las políticas de los sitios
3. **User Agent**: El scraper usa un User-Agent genérico
4. **Legal**: Asegúrate de cumplir con términos de servicio

## 💡 Tips

1. **No hagas scraping muy frecuente**: Cada hora es suficiente
2. **Revisa las noticias periódicamente**: Elimina noticias antiguas
3. **Logs**: Monitorea errores de scraping
4. **Imágenes**: Algunas pueden no cargar (protección anti-hotlink)
5. **Backup**: Exporta noticias importantes antes de limpiar la BD

## 🎯 Futuras Mejoras

- [ ] Categorización automática con IA
- [ ] Resúmenes generados con LLM
- [ ] Análisis de sentimiento
- [ ] Detección de fake news
- [ ] Notificaciones push de noticias importantes
- [ ] Widget de noticias en la página principal
- [ ] Exportar noticias a PDF/Excel

---

¿Necesitas ayuda con el web scraper? Consulta los logs o crea un issue en GitHub.
