from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from models import db, Usuario, Candidato, Pregunta, RespuestaCandidato, Configuracion, FuenteNoticia
import bcrypt
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Decorador para requerir autenticación admin
def admin_required(f):
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'error': 'No autenticado'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# ==================== AUTENTICACIÓN ====================

@admin_bp.route('/login', methods=['POST'])
def login():
    """Login de administrador"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña requeridos'}), 400

    usuario = Usuario.query.filter_by(username=username).first()

    if not usuario or not bcrypt.checkpw(password.encode('utf-8'), usuario.password_hash.encode('utf-8')):
        return jsonify({'error': 'Credenciales inválidas'}), 401

    login_user(usuario)
    return jsonify({
        'message': 'Login exitoso',
        'user': {
            'id': usuario.id,
            'username': usuario.username,
            'email': usuario.email
        }
    }), 200

@admin_bp.route('/logout', methods=['POST'])
@admin_required
def logout():
    """Logout de administrador"""
    logout_user()
    return jsonify({'message': 'Logout exitoso'}), 200

@admin_bp.route('/check-auth', methods=['GET'])
def check_auth():
    """Verificar si está autenticado"""
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email
            }
        }), 200
    return jsonify({'authenticated': False}), 200

# ==================== CONFIGURACIÓN ====================

@admin_bp.route('/config', methods=['GET'])
@admin_required
def get_config():
    """Obtener configuración general"""
    config = Configuracion.query.first()
    if not config:
        return jsonify({'error': 'Configuración no encontrada'}), 404

    return jsonify({
        'election_year': config.election_year,
        'election_title': config.election_title,
        'election_type': config.election_type,
        'site_name': config.site_name,
        'maintenance_mode': config.maintenance_mode
    }), 200

@admin_bp.route('/config', methods=['PUT'])
@admin_required
def update_config():
    """Actualizar configuración general"""
    data = request.json
    config = Configuracion.query.first()

    if not config:
        config = Configuracion()
        db.session.add(config)

    if 'election_year' in data:
        config.election_year = data['election_year']
    if 'election_title' in data:
        config.election_title = data['election_title']
    if 'election_type' in data:
        config.election_type = data['election_type']
    if 'site_name' in data:
        config.site_name = data['site_name']
    if 'maintenance_mode' in data:
        config.maintenance_mode = data['maintenance_mode']

    config.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Configuración actualizada'}), 200

# ==================== CANDIDATOS ====================

@admin_bp.route('/candidatos', methods=['GET'])
@admin_required
def get_candidatos_admin():
    """Listar todos los candidatos (admin)"""
    candidatos = Candidato.query.all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'partido': c.partido,
        'foto_url': c.foto_url,
        'biografia': c.biografia,
        'programa': c.programa,
        'linea_tiempo': c.linea_tiempo
    } for c in candidatos]), 200

@admin_bp.route('/candidatos', methods=['POST'])
@admin_required
def create_candidato():
    """Crear nuevo candidato"""
    data = request.json

    candidato = Candidato(
        nombre=data.get('nombre'),
        partido=data.get('partido'),
        foto_url=data.get('foto_url', ''),
        biografia=data.get('biografia', ''),
        programa=data.get('programa', {}),
        linea_tiempo=data.get('linea_tiempo', [])
    )

    db.session.add(candidato)
    db.session.commit()

    return jsonify({
        'message': 'Candidato creado',
        'id': candidato.id
    }), 201

@admin_bp.route('/candidatos/<int:id>', methods=['PUT'])
@admin_required
def update_candidato(id):
    """Actualizar candidato"""
    candidato = Candidato.query.get_or_404(id)
    data = request.json

    if 'nombre' in data:
        candidato.nombre = data['nombre']
    if 'partido' in data:
        candidato.partido = data['partido']
    if 'foto_url' in data:
        candidato.foto_url = data['foto_url']
    if 'biografia' in data:
        candidato.biografia = data['biografia']
    if 'programa' in data:
        candidato.programa = data['programa']
    if 'linea_tiempo' in data:
        candidato.linea_tiempo = data['linea_tiempo']

    db.session.commit()

    return jsonify({'message': 'Candidato actualizado'}), 200

@admin_bp.route('/candidatos/<int:id>', methods=['DELETE'])
@admin_required
def delete_candidato(id):
    """Eliminar candidato"""
    candidato = Candidato.query.get_or_404(id)
    db.session.delete(candidato)
    db.session.commit()

    return jsonify({'message': 'Candidato eliminado'}), 200

# ==================== PREGUNTAS DEL QUIZ ====================

@admin_bp.route('/preguntas', methods=['GET'])
@admin_required
def get_preguntas_admin():
    """Listar todas las preguntas"""
    preguntas = Pregunta.query.order_by(Pregunta.orden).all()
    return jsonify([{
        'id': p.id,
        'texto': p.texto,
        'categoria': p.categoria,
        'orden': p.orden
    } for p in preguntas]), 200

@admin_bp.route('/preguntas', methods=['POST'])
@admin_required
def create_pregunta():
    """Crear nueva pregunta"""
    data = request.json

    # Obtener el próximo número de orden
    max_orden = db.session.query(db.func.max(Pregunta.orden)).scalar() or 0

    pregunta = Pregunta(
        texto=data.get('texto'),
        categoria=data.get('categoria'),
        orden=data.get('orden', max_orden + 1)
    )

    db.session.add(pregunta)
    db.session.commit()

    return jsonify({
        'message': 'Pregunta creada',
        'id': pregunta.id
    }), 201

@admin_bp.route('/preguntas/<int:id>', methods=['PUT'])
@admin_required
def update_pregunta(id):
    """Actualizar pregunta"""
    pregunta = Pregunta.query.get_or_404(id)
    data = request.json

    if 'texto' in data:
        pregunta.texto = data['texto']
    if 'categoria' in data:
        pregunta.categoria = data['categoria']
    if 'orden' in data:
        pregunta.orden = data['orden']

    db.session.commit()

    return jsonify({'message': 'Pregunta actualizada'}), 200

@admin_bp.route('/preguntas/<int:id>', methods=['DELETE'])
@admin_required
def delete_pregunta(id):
    """Eliminar pregunta"""
    pregunta = Pregunta.query.get_or_404(id)
    db.session.delete(pregunta)
    db.session.commit()

    return jsonify({'message': 'Pregunta eliminada'}), 200

# ==================== RESPUESTAS DE CANDIDATOS ====================

@admin_bp.route('/respuestas', methods=['GET'])
@admin_required
def get_respuestas_admin():
    """Obtener todas las respuestas de candidatos"""
    respuestas = RespuestaCandidato.query.all()
    return jsonify([{
        'id': r.id,
        'pregunta_id': r.pregunta_id,
        'candidato_id': r.candidato_id,
        'posicion': r.posicion
    } for r in respuestas]), 200

@admin_bp.route('/respuestas', methods=['POST'])
@admin_required
def create_respuesta():
    """Crear respuesta de candidato a pregunta"""
    data = request.json

    # Verificar si ya existe
    existente = RespuestaCandidato.query.filter_by(
        pregunta_id=data.get('pregunta_id'),
        candidato_id=data.get('candidato_id')
    ).first()

    if existente:
        existente.posicion = data.get('posicion')
        db.session.commit()
        return jsonify({'message': 'Respuesta actualizada'}), 200

    respuesta = RespuestaCandidato(
        pregunta_id=data.get('pregunta_id'),
        candidato_id=data.get('candidato_id'),
        posicion=data.get('posicion')
    )

    db.session.add(respuesta)
    db.session.commit()

    return jsonify({'message': 'Respuesta creada'}), 201

# ==================== FUENTES DE NOTICIAS ====================

@admin_bp.route('/fuentes-noticias', methods=['GET'])
@admin_required
def get_fuentes_noticias_admin():
    """Listar fuentes de noticias"""
    fuentes = FuenteNoticia.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': f.id,
        'name': f.name,
        'source_id': f.source_id,
        'url': f.url,
        'rss': f.rss,
        'type': f.type,
        'logo': f.logo,
        'is_active': f.is_active
    } for f in fuentes]), 200

@admin_bp.route('/fuentes-noticias', methods=['POST'])
@admin_required
def create_fuente_noticia():
    """Crear fuente de noticias"""
    data = request.json

    fuente = FuenteNoticia(
        name=data.get('name'),
        source_id=data.get('source_id'),
        url=data.get('url', ''),
        rss=data.get('rss', ''),
        type=data.get('type', 'rss'),
        logo=data.get('logo', ''),
        is_active=data.get('is_active', True)
    )

    db.session.add(fuente)
    db.session.commit()

    return jsonify({
        'message': 'Fuente de noticias creada',
        'id': fuente.id
    }), 201

@admin_bp.route('/fuentes-noticias/<int:id>', methods=['PUT'])
@admin_required
def update_fuente_noticia(id):
    """Actualizar fuente de noticias"""
    fuente = FuenteNoticia.query.get_or_404(id)
    data = request.json

    if 'name' in data:
        fuente.name = data['name']
    if 'source_id' in data:
        fuente.source_id = data['source_id']
    if 'url' in data:
        fuente.url = data['url']
    if 'rss' in data:
        fuente.rss = data['rss']
    if 'type' in data:
        fuente.type = data['type']
    if 'logo' in data:
        fuente.logo = data['logo']
    if 'is_active' in data:
        fuente.is_active = data['is_active']

    db.session.commit()

    return jsonify({'message': 'Fuente actualizada'}), 200

@admin_bp.route('/fuentes-noticias/<int:id>', methods=['DELETE'])
@admin_required
def delete_fuente_noticia(id):
    """Eliminar fuente de noticias"""
    fuente = FuenteNoticia.query.get_or_404(id)
    db.session.delete(fuente)
    db.session.commit()

    return jsonify({'message': 'Fuente eliminada'}), 200

# ==================== ESTADÍSTICAS ====================

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    """Obtener estadísticas generales"""
    from models import Voto, Noticia

    total_candidatos = Candidato.query.count()
    total_preguntas = Pregunta.query.count()
    total_votos = Voto.query.count()
    total_noticias = Noticia.query.filter_by(is_active=True).count()

    # Votos por candidato
    votos_por_candidato = db.session.query(
        Candidato.nombre,
        db.func.count(Voto.id).label('votos')
    ).join(Voto).group_by(Candidato.id, Candidato.nombre).all()

    return jsonify({
        'total_candidatos': total_candidatos,
        'total_preguntas': total_preguntas,
        'total_votos': total_votos,
        'total_noticias': total_noticias,
        'votos_por_candidato': [{'candidato': v[0], 'votos': v[1]} for v in votos_por_candidato]
    }), 200

# ==================== UTILIDADES ====================

@admin_bp.route('/reset-votes', methods=['POST'])
@admin_required
def reset_votes():
    """Reiniciar todos los votos"""
    from models import Voto
    Voto.query.delete()
    db.session.commit()

    return jsonify({'message': 'Votos reiniciados'}), 200

@admin_bp.route('/reset-news', methods=['POST'])
@admin_required
def reset_news():
    """Eliminar todas las noticias"""
    from models import Noticia
    Noticia.query.delete()
    db.session.commit()

    return jsonify({'message': 'Noticias eliminadas'}), 200
