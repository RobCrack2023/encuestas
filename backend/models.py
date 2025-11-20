from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

# Usuario administrador
class Usuario(UserMixin, db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

# Configuración general del sitio
class Configuracion(db.Model):
    __tablename__ = 'configuracion'
    id = db.Column(db.Integer, primary_key=True)
    election_year = db.Column(db.String(4), default='2024')
    election_title = db.Column(db.String(200), default='Elecciones Presidenciales Chile')
    election_type = db.Column(db.String(50), default='Presidenciales')
    site_name = db.Column(db.String(200), default='Sistema de Encuestas')
    maintenance_mode = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Candidatos
class Candidato(db.Model):
    __tablename__ = 'candidatos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    partido = db.Column(db.String(100))
    foto_url = db.Column(db.String(255))
    biografia = db.Column(db.Text)
    programa = db.Column(db.JSON)
    linea_tiempo = db.Column(db.JSON)
    votos = db.relationship('Voto', backref='candidato', lazy=True, cascade='all, delete-orphan')

# Votos
class Voto(db.Model):
    __tablename__ = 'votos'
    id = db.Column(db.Integer, primary_key=True)
    candidato_id = db.Column(db.Integer, db.ForeignKey('candidatos.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_hash = db.Column(db.String(64))

# Preguntas del quiz
class Pregunta(db.Model):
    __tablename__ = 'preguntas'
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(500), nullable=False)
    categoria = db.Column(db.String(50))
    orden = db.Column(db.Integer)

# Respuestas de candidatos a preguntas
class RespuestaCandidato(db.Model):
    __tablename__ = 'respuestas_candidato'
    id = db.Column(db.Integer, primary_key=True)
    pregunta_id = db.Column(db.Integer, db.ForeignKey('preguntas.id'), nullable=False)
    candidato_id = db.Column(db.Integer, db.ForeignKey('candidatos.id'), nullable=False)
    posicion = db.Column(db.Integer)  # 1-5
    pregunta = db.relationship('Pregunta', backref='respuestas')
    candidato_rel = db.relationship('Candidato', backref='respuestas')

# Noticias
class Noticia(db.Model):
    __tablename__ = 'noticias'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(1000), nullable=False, unique=True)
    summary = db.Column(db.Text)
    published_at = db.Column(db.DateTime)
    source = db.Column(db.String(100))
    source_id = db.Column(db.String(50))
    source_logo = db.Column(db.String(255))
    image_url = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

# Fuentes de noticias (configurables)
class FuenteNoticia(db.Model):
    __tablename__ = 'fuentes_noticias'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    source_id = db.Column(db.String(50), unique=True, nullable=False)
    url = db.Column(db.String(500))
    rss = db.Column(db.String(500))
    type = db.Column(db.String(20), default='rss')  # 'rss' o 'html'
    logo = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
