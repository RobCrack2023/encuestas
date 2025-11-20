#!/usr/bin/env python3
"""
Script para crear el usuario administrador inicial

Uso:
    python create_admin.py

O con variables de entorno:
    ADMIN_USERNAME=admin ADMIN_PASSWORD=tu_password python create_admin.py
"""

import os
import sys
import bcrypt
from app import app, db
from models import Usuario, Configuracion

def create_admin_user():
    """Crea el usuario administrador inicial"""

    # Obtener credenciales de variables de entorno o usar valores por defecto
    username = os.getenv('ADMIN_USERNAME', 'admin')
    password = os.getenv('ADMIN_PASSWORD', 'admin123')  # CAMBIAR EN PRODUCCIÓN
    email = os.getenv('ADMIN_EMAIL', 'admin@encuestas.local')

    with app.app_context():
        # Verificar si ya existe un administrador
        existing = Usuario.query.filter_by(username=username).first()

        if existing:
            print(f"❌ El usuario '{username}' ya existe.")
            respuesta = input("¿Deseas actualizar la contraseña? (s/N): ")

            if respuesta.lower() == 's':
                # Hash de la nueva contraseña
                password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                existing.password_hash = password_hash
                db.session.commit()
                print(f"✅ Contraseña actualizada para '{username}'")
            else:
                print("Operación cancelada.")
            return

        # Crear hash de la contraseña
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Crear usuario
        admin = Usuario(
            username=username,
            email=email,
            password_hash=password_hash,
            is_active=True
        )

        db.session.add(admin)
        db.session.commit()

        print("=" * 50)
        print("✅ Usuario administrador creado exitosamente")
        print("=" * 50)
        print(f"Username: {username}")
        print(f"Password: {password}")
        print(f"Email: {email}")
        print("=" * 50)
        print("⚠️  IMPORTANTE: Cambia la contraseña después del primer login")
        print("=" * 50)

def create_default_config():
    """Crea la configuración por defecto si no existe"""

    with app.app_context():
        config = Configuracion.query.first()

        if not config:
            config = Configuracion(
                election_year='2024',
                election_title='Elecciones Presidenciales Chile',
                election_type='Presidenciales',
                site_name='Sistema de Encuestas'
            )
            db.session.add(config)
            db.session.commit()
            print("✅ Configuración por defecto creada")
        else:
            print("ℹ️  La configuración ya existe")

if __name__ == '__main__':
    print("\n🔧 Inicializando base de datos...\n")

    with app.app_context():
        # Crear todas las tablas
        db.create_all()
        print("✅ Tablas creadas\n")

    # Crear configuración
    create_default_config()

    print()

    # Crear usuario admin
    create_admin_user()

    print("\n✨ Proceso completado\n")
    print("Accede al panel admin en: http://tudominio.cl/admin")
    print("Login en: http://tudominio.cl/admin/login\n")
