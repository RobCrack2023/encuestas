from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv
from flask_login import LoginManager
import bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://encuestas_user:password@localhost/encuestas_db')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Configuración de la elección
ELECTION_YEAR = os.getenv('ELECTION_YEAR', '2024')
ELECTION_TITLE = os.getenv('ELECTION_TITLE', 'Elecciones Presidenciales Chile')
ELECTION_TYPE = os.getenv('ELECTION_TYPE', 'Presidenciales')

# Importar modelos desde models.py
from models import (
    db, Usuario, Configuracion, Candidato, Voto,
    Pregunta, RespuestaCandidato, Noticia, FuenteNoticia
)

# Inicializar db con la app
db.init_app(app)

# Configurar Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin.login'

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

# Importar y registrar rutas admin
from admin_routes import admin_bp
app.register_blueprint(admin_bp)

# Rutas API
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'API funcionando correctamente'})

@app.route('/api/config', methods=['GET'])
def get_config():
    # Obtener config desde BD si existe, sino usar variables de entorno
    config = Configuracion.query.first()
    if config:
        return jsonify({
            'year': config.election_year,
            'title': config.election_title,
            'type': config.election_type
        })
    else:
        return jsonify({
            'year': ELECTION_YEAR,
            'title': ELECTION_TITLE,
            'type': ELECTION_TYPE
        })

@app.route('/api/candidatos', methods=['GET'])
def get_candidatos():
    candidatos = Candidato.query.all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'partido': c.partido,
        'foto_url': c.foto_url,
        'biografia': c.biografia,
        'programa': c.programa,
        'linea_tiempo': c.linea_tiempo
    } for c in candidatos])

@app.route('/api/candidatos/<int:id>', methods=['GET'])
def get_candidato(id):
    candidato = Candidato.query.get_or_404(id)
    return jsonify({
        'id': candidato.id,
        'nombre': candidato.nombre,
        'partido': candidato.partido,
        'foto_url': candidato.foto_url,
        'biografia': candidato.biografia,
        'programa': candidato.programa,
        'linea_tiempo': candidato.linea_tiempo
    })

@app.route('/api/votar', methods=['POST'])
def votar():
    data = request.json
    candidato_id = data.get('candidato_id')
    ip_hash = data.get('ip_hash')

    if not candidato_id:
        return jsonify({'error': 'candidato_id requerido'}), 400

    # Verificar si ya votó (simple verificación por sesión)
    voto_existente = Voto.query.filter_by(ip_hash=ip_hash).first()
    if voto_existente:
        return jsonify({'error': 'Ya has votado'}), 403

    nuevo_voto = Voto(candidato_id=candidato_id, ip_hash=ip_hash)
    db.session.add(nuevo_voto)
    db.session.commit()

    return jsonify({'message': 'Voto registrado exitosamente'}), 201

@app.route('/api/resultados', methods=['GET'])
def get_resultados():
    candidatos = Candidato.query.all()
    total_votos = Voto.query.count()

    resultados = []
    for c in candidatos:
        votos_candidato = Voto.query.filter_by(candidato_id=c.id).count()
        porcentaje = (votos_candidato / total_votos * 100) if total_votos > 0 else 0
        resultados.append({
            'candidato_id': c.id,
            'nombre': c.nombre,
            'votos': votos_candidato,
            'porcentaje': round(porcentaje, 2)
        })

    return jsonify({
        'total_votos': total_votos,
        'resultados': resultados
    })

@app.route('/api/quiz/preguntas', methods=['GET'])
def get_preguntas():
    preguntas = Pregunta.query.order_by(Pregunta.orden).all()
    return jsonify([{
        'id': p.id,
        'texto': p.texto,
        'categoria': p.categoria
    } for p in preguntas])

@app.route('/api/quiz/calcular', methods=['POST'])
def calcular_afinidad():
    data = request.json
    respuestas_usuario = data.get('respuestas', [])  # [{pregunta_id, posicion}]

    candidatos = Candidato.query.all()
    afinidades = []

    for candidato in candidatos:
        puntos = 0
        total_preguntas = len(respuestas_usuario)

        for resp_usuario in respuestas_usuario:
            resp_candidato = RespuestaCandidato.query.filter_by(
                pregunta_id=resp_usuario['pregunta_id'],
                candidato_id=candidato.id
            ).first()

            if resp_candidato:
                # Calcular diferencia (menor diferencia = mayor afinidad)
                diferencia = abs(resp_candidato.posicion - resp_usuario['posicion'])
                puntos += (4 - diferencia) * 25  # Escala 0-100

        porcentaje_afinidad = (puntos / (total_preguntas * 100)) * 100 if total_preguntas > 0 else 0
        afinidades.append({
            'candidato_id': candidato.id,
            'nombre': candidato.nombre,
            'afinidad': round(porcentaje_afinidad, 1)
        })

    return jsonify(sorted(afinidades, key=lambda x: x['afinidad'], reverse=True))

@app.route('/api/noticias', methods=['GET'])
def get_noticias():
    """Obtiene noticias almacenadas en la base de datos"""
    limit = request.args.get('limit', 20, type=int)
    source = request.args.get('source', None)

    query = Noticia.query.filter_by(is_active=True)

    if source:
        query = query.filter_by(source_id=source)

    noticias = query.order_by(Noticia.published_at.desc()).limit(limit).all()

    return jsonify([{
        'id': n.id,
        'title': n.title,
        'url': n.url,
        'summary': n.summary,
        'published_at': n.published_at.isoformat() if n.published_at else None,
        'source': n.source,
        'source_id': n.source_id,
        'source_logo': n.source_logo,
        'image_url': n.image_url
    } for n in noticias])

@app.route('/api/noticias/actualizar', methods=['POST'])
def actualizar_noticias():
    """Ejecuta el scraper y actualiza las noticias"""
    try:
        from scraper.news_scraper import get_political_news

        # Scrape noticias
        noticias_scraped = get_political_news(limit=50)

        nuevas = 0
        for noticia_data in noticias_scraped:
            # Verificar si ya existe por URL
            existente = Noticia.query.filter_by(url=noticia_data['url']).first()

            if not existente:
                nueva_noticia = Noticia(
                    title=noticia_data['title'],
                    url=noticia_data['url'],
                    summary=noticia_data['summary'],
                    published_at=noticia_data['published_at'],
                    source=noticia_data['source'],
                    source_id=noticia_data['source_id'],
                    source_logo=noticia_data['source_logo'],
                    image_url=noticia_data['image_url']
                )
                db.session.add(nueva_noticia)
                nuevas += 1

        db.session.commit()

        return jsonify({
            'message': f'{nuevas} noticias nuevas agregadas',
            'total_scraped': len(noticias_scraped),
            'nuevas': nuevas
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/noticias/fuentes', methods=['GET'])
def get_fuentes():
    """Lista las fuentes de noticias configuradas"""
    from scraper.news_scraper import NewsScraper
    scraper = NewsScraper()

    fuentes = [{
        'id': source_id,
        'name': source_config['name'],
        'logo': source_config['logo'],
        'type': source_config['type']
    } for source_id, source_config in scraper.sources.items()]

    return jsonify(fuentes)

@app.route('/api/comparar', methods=['GET'])
def comparar_candidatos():
    candidatos = Candidato.query.all()
    if len(candidatos) < 2:
        return jsonify({'error': 'Se necesitan al menos 2 candidatos'}), 400

    comparacion = {
        'candidatos': [{
            'id': c.id,
            'nombre': c.nombre,
            'partido': c.partido,
            'foto_url': c.foto_url
        } for c in candidatos],
        'programas': {}
    }

    # Extraer categorías comunes
    if candidatos[0].programa and candidatos[1].programa:
        categorias = set(candidatos[0].programa.keys()) & set(candidatos[1].programa.keys())
        for cat in categorias:
            comparacion['programas'][cat] = {
                candidatos[0].nombre: candidatos[0].programa[cat],
                candidatos[1].nombre: candidatos[1].programa[cat]
            }

    return jsonify(comparacion)

# Inicializar base de datos con datos de ejemplo
@app.route('/api/init-db', methods=['POST'])
def init_db():
    db.create_all()

    # Limpiar datos existentes
    Candidato.query.delete()
    Pregunta.query.delete()
    RespuestaCandidato.query.delete()
    Voto.query.delete()

    # Crear configuración inicial si no existe
    config = Configuracion.query.first()
    if not config:
        config = Configuracion(
            election_year=ELECTION_YEAR,
            election_title=ELECTION_TITLE,
            election_type=ELECTION_TYPE,
            site_name='Sistema de Encuestas',
            maintenance_mode=False
        )
        db.session.add(config)
        db.session.commit()

    # Crear candidatos de ejemplo
    candidato1 = Candidato(
        nombre="José Antonio Kast",
        partido="Partido Republicano",
        foto_url="/images/candidato1.jpg",
        biografia="Abogado y político chileno, fundador del Partido Republicano.",
        programa={
            "Economía": "Reducción de impuestos, apoyo a empresas, libre mercado",
            "Seguridad": "Mano dura contra la delincuencia, más policías",
            "Educación": "Vouchers educativos, libertad de elección",
            "Salud": "Sistema mixto público-privado fortalecido"
        },
        linea_tiempo=[
            {"año": 1997, "evento": "Egresa como abogado de la Universidad de los Andes"},
            {"año": 2002, "evento": "Primer cargo político como Concejal"},
            {"año": 2018, "evento": "Funda el Partido Republicano"},
            {"año": 2021, "evento": "Segunda vuelta presidencial"}
        ]
    )

    candidato2 = Candidato(
        nombre="Gabriel Boric",
        partido="Apruebo Dignidad",
        foto_url="/images/candidato2.jpg",
        biografia="Abogado y político chileno, ex presidente de la FECH.",
        programa={
            "Economía": "Mayor redistribución, reforma tributaria progresiva",
            "Seguridad": "Enfoque en prevención y cohesión social",
            "Educación": "Educación pública gratuita y de calidad",
            "Salud": "Sistema único de salud universal"
        },
        linea_tiempo=[
            {"año": 2011, "evento": "Líder estudiantil en movilizaciones"},
            {"año": 2014, "evento": "Electo diputado por Magallanes"},
            {"año": 2017, "evento": "Fundación del Frente Amplio"},
            {"año": 2021, "evento": "Electo Presidente de Chile"}
        ]
    )

    db.session.add_all([candidato1, candidato2])
    db.session.commit()

    # Crear preguntas para el quiz
    preguntas_quiz = [
        {"texto": "El Estado debe tener un rol principal en la economía", "categoria": "Economía", "orden": 1},
        {"texto": "Se deben aumentar los impuestos a los más ricos", "categoria": "Economía", "orden": 2},
        {"texto": "La educación universitaria debe ser gratuita", "categoria": "Educación", "orden": 3},
        {"texto": "Se necesitan penas más duras para los delincuentes", "categoria": "Seguridad", "orden": 4},
        {"texto": "El sistema de salud debe ser completamente público", "categoria": "Salud", "orden": 5},
        {"texto": "Las empresas privadas son más eficientes que el Estado", "categoria": "Economía", "orden": 6},
        {"texto": "Se debe priorizar la rehabilitación sobre el castigo", "categoria": "Seguridad", "orden": 7},
        {"texto": "El cambio climático requiere acción gubernamental urgente", "categoria": "Medio Ambiente", "orden": 8}
    ]

    for pq in preguntas_quiz:
        pregunta = Pregunta(**pq)
        db.session.add(pregunta)

    db.session.commit()

    # Asignar respuestas a candidatos (1=muy en desacuerdo, 5=muy de acuerdo)
    preguntas = Pregunta.query.all()
    respuestas_kast = [2, 1, 2, 5, 2, 5, 2, 3]  # Posiciones conservadoras/derecha
    respuestas_boric = [4, 5, 5, 2, 5, 2, 4, 5]  # Posiciones progresistas/izquierda

    for i, pregunta in enumerate(preguntas):
        resp1 = RespuestaCandidato(pregunta_id=pregunta.id, candidato_id=1, posicion=respuestas_kast[i])
        resp2 = RespuestaCandidato(pregunta_id=pregunta.id, candidato_id=2, posicion=respuestas_boric[i])
        db.session.add_all([resp1, resp2])

    db.session.commit()

    return jsonify({'message': 'Base de datos inicializada correctamente'}), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
