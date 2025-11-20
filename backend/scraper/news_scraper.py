import requests
from bs4 import BeautifulSoup
import feedparser
from datetime import datetime, timedelta
import re

class NewsScraper:
    """
    Web scraper para noticias políticas y electorales de múltiples fuentes
    """

    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.sources = {
            'emol': {
                'name': 'Emol',
                'url': 'https://www.emol.com/noticias/Nacional/',
                'type': 'html',
                'logo': '/images/emol-logo.png'
            },
            'latercera': {
                'name': 'La Tercera',
                'url': 'https://www.latercera.com/politica/',
                'type': 'html',
                'logo': '/images/latercera-logo.png'
            },
            'biobio': {
                'name': 'BioBío Chile',
                'rss': 'https://www.biobiochile.cl/lista/feed/rss2/politica',
                'type': 'rss',
                'logo': '/images/biobio-logo.png'
            },
            't13': {
                'name': 'T13',
                'rss': 'https://www.t13.cl/rss/politica.xml',
                'type': 'rss',
                'logo': '/images/t13-logo.png'
            }
        }

    def scrape_all(self, limit=20, keywords=None):
        """
        Scrape noticias de todas las fuentes configuradas

        Args:
            limit: Número máximo de noticias por fuente
            keywords: Lista de palabras clave para filtrar (ej: ['elecciones', 'presidencial'])

        Returns:
            Lista de noticias con formato estandarizado
        """
        all_news = []

        for source_id, source_config in self.sources.items():
            try:
                if source_config['type'] == 'rss':
                    news = self._scrape_rss(source_id, source_config, limit)
                else:
                    news = self._scrape_html(source_id, source_config, limit)

                # Filtrar por keywords si se proporcionan
                if keywords:
                    news = self._filter_by_keywords(news, keywords)

                all_news.extend(news)
            except Exception as e:
                print(f"Error scraping {source_config['name']}: {str(e)}")
                continue

        # Ordenar por fecha (más recientes primero)
        all_news.sort(key=lambda x: x['published_at'], reverse=True)

        return all_news[:limit]

    def _scrape_rss(self, source_id, config, limit):
        """Scrape noticias desde un feed RSS"""
        news = []

        try:
            feed = feedparser.parse(config['rss'])

            for entry in feed.entries[:limit]:
                news_item = {
                    'title': entry.title,
                    'url': entry.link,
                    'summary': self._clean_html(entry.get('summary', entry.get('description', ''))),
                    'published_at': self._parse_date(entry.get('published', '')),
                    'source': config['name'],
                    'source_id': source_id,
                    'source_logo': config['logo'],
                    'image_url': self._extract_image_from_rss(entry)
                }
                news.append(news_item)

        except Exception as e:
            print(f"Error parsing RSS {config['name']}: {str(e)}")

        return news

    def _scrape_html(self, source_id, config, limit):
        """Scrape noticias desde HTML (método genérico)"""
        news = []

        try:
            response = requests.get(config['url'], headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Estrategia genérica: buscar artículos
            articles = soup.find_all(['article', 'div'], class_=re.compile(r'(noticia|articulo|card|item|story)', re.I), limit=limit*2)

            for article in articles[:limit]:
                try:
                    # Buscar título
                    title_elem = article.find(['h1', 'h2', 'h3', 'h4', 'a'], class_=re.compile(r'(titulo|title|headline)', re.I))
                    if not title_elem:
                        title_elem = article.find(['h1', 'h2', 'h3'])

                    if not title_elem:
                        continue

                    title = title_elem.get_text(strip=True)

                    # Buscar URL
                    link_elem = title_elem if title_elem.name == 'a' else title_elem.find('a')
                    if not link_elem:
                        link_elem = article.find('a')

                    if not link_elem or not link_elem.get('href'):
                        continue

                    url = link_elem.get('href')
                    if not url.startswith('http'):
                        base_url = '/'.join(config['url'].split('/')[:3])
                        url = base_url + url if url.startswith('/') else base_url + '/' + url

                    # Buscar resumen/descripción
                    summary_elem = article.find(['p', 'div'], class_=re.compile(r'(resumen|summary|excerpt|bajada)', re.I))
                    summary = summary_elem.get_text(strip=True)[:300] if summary_elem else title

                    # Buscar imagen
                    img_elem = article.find('img')
                    image_url = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
                    if image_url and not image_url.startswith('http'):
                        base_url = '/'.join(config['url'].split('/')[:3])
                        image_url = base_url + image_url if image_url.startswith('/') else base_url + '/' + image_url

                    news_item = {
                        'title': title,
                        'url': url,
                        'summary': summary,
                        'published_at': datetime.now() - timedelta(hours=len(news)),  # Estimación
                        'source': config['name'],
                        'source_id': source_id,
                        'source_logo': config['logo'],
                        'image_url': image_url
                    }

                    news.append(news_item)

                except Exception as e:
                    continue

        except Exception as e:
            print(f"Error scraping HTML {config['name']}: {str(e)}")

        return news

    def _extract_image_from_rss(self, entry):
        """Extrae URL de imagen de una entrada RSS"""
        # Intentar obtener de media:content
        if hasattr(entry, 'media_content') and entry.media_content:
            return entry.media_content[0].get('url')

        # Intentar obtener de enclosure
        if hasattr(entry, 'enclosures') and entry.enclosures:
            for enclosure in entry.enclosures:
                if 'image' in enclosure.get('type', ''):
                    return enclosure.get('href')

        # Intentar extraer de la descripción HTML
        if hasattr(entry, 'summary'):
            soup = BeautifulSoup(entry.summary, 'html.parser')
            img = soup.find('img')
            if img and img.get('src'):
                return img.get('src')

        return None

    def _clean_html(self, text):
        """Limpia tags HTML de un texto"""
        if not text:
            return ''
        soup = BeautifulSoup(text, 'html.parser')
        return soup.get_text(strip=True)[:300]  # Limitar a 300 caracteres

    def _parse_date(self, date_str):
        """Parsea fecha de diferentes formatos"""
        if not date_str:
            return datetime.now()

        try:
            # Intentar parsear con feedparser
            parsed = feedparser._parse_date(date_str)
            if parsed:
                return datetime(*parsed[:6])
        except:
            pass

        return datetime.now()

    def _filter_by_keywords(self, news, keywords):
        """Filtra noticias por palabras clave"""
        if not keywords:
            return news

        filtered = []
        keywords_lower = [k.lower() for k in keywords]

        for item in news:
            text = (item['title'] + ' ' + item['summary']).lower()
            if any(keyword in text for keyword in keywords_lower):
                filtered.append(item)

        return filtered


# Función auxiliar para usar directamente
def get_political_news(limit=20):
    """
    Obtiene noticias políticas/electorales

    Returns:
        Lista de noticias filtradas por keywords políticas
    """
    scraper = NewsScraper()
    keywords = [
        'elecciones', 'presidencial', 'candidato', 'campaña',
        'votación', 'encuesta', 'política', 'gobierno',
        'congreso', 'senado', 'diputado', 'electoral'
    ]
    return scraper.scrape_all(limit=limit, keywords=keywords)
