# Ejemplo: Cómo Cambiar Candidatos

## Ubicación

Archivo: `backend/app.py`
Función: `init_db()` (aproximadamente línea 170)

## Ejemplo de Configuración

```python
# Crear candidatos de ejemplo
candidato1 = Candidato(
    nombre="Tu Candidato 1",
    partido="Nombre del Partido 1",
    foto_url="/images/candidato1.jpg",
    biografia="Biografía completa del candidato. Incluye formación académica, trayectoria profesional y política.",
    programa={
        "Economía": "Propuesta económica detallada: crecimiento, empleo, impuestos",
        "Seguridad": "Plan de seguridad ciudadana y orden público",
        "Educación": "Reforma educativa y acceso a educación de calidad",
        "Salud": "Sistema de salud y cobertura universal",
        "Medio Ambiente": "Políticas ambientales y cambio climático"
    },
    linea_tiempo=[
        {"año": 1995, "evento": "Graduación universitaria en..."},
        {"año": 2005, "evento": "Primer cargo público como..."},
        {"año": 2015, "evento": "Electo como..."},
        {"año": 2020, "evento": "Funda/lidera..."},
        {"año": 2024, "evento": "Candidato presidencial"}
    ]
)

candidato2 = Candidato(
    nombre="Tu Candidato 2",
    partido="Nombre del Partido 2",
    foto_url="/images/candidato2.jpg",
    biografia="Biografía del segundo candidato...",
    programa={
        "Economía": "Propuesta económica alternativa...",
        "Seguridad": "Enfoque diferente en seguridad...",
        "Educación": "Visión educativa...",
        "Salud": "Modelo de salud propuesto...",
        "Medio Ambiente": "Plan ambiental..."
    },
    linea_tiempo=[
        {"año": 1990, "evento": "Inicio carrera política..."},
        {"año": 2000, "evento": "Cargo importante..."},
        {"año": 2010, "evento": "Líder de movimiento..."},
        {"año": 2024, "evento": "Postulación presidencial"}
    ]
)
```

## Ajustar Respuestas del Quiz

Las respuestas deben coincidir con el número de preguntas (actualmente 8):

```python
# Escala: 1=Muy en desacuerdo, 2=En desacuerdo, 3=Neutral, 4=De acuerdo, 5=Muy de acuerdo

respuestas_candidato1 = [5, 4, 3, 5, 2, 5, 3, 4]  # 8 valores
respuestas_candidato2 = [2, 3, 5, 1, 4, 2, 5, 3]  # 8 valores
```

**Importante**:
- Cada candidato debe tener exactamente 8 respuestas (una por cada pregunta)
- Los valores deben ser del 1 al 5
- Respuestas opuestas crean mayor diferenciación en el quiz

## Después de Editar

1. Guarda el archivo (`Ctrl+O`, Enter, `Ctrl+X`)

2. Reinicializa la base de datos:
```bash
curl -X POST http://localhost:5000/api/init-db
```

3. Reinicia el servicio:
```bash
sudo systemctl restart encuestas
```

## Categorías de Programa

Puedes agregar o cambiar categorías. Las que uses en `programa={}` aparecerán en el comparador:

```python
programa={
    "Economía": "...",
    "Seguridad": "...",
    "Educación": "...",
    "Salud": "...",
    "Vivienda": "...",           # Nueva categoría
    "Transporte": "...",         # Nueva categoría
    "Política Exterior": "..."   # Nueva categoría
}
```

## Agregar Más Candidatos

Actualmente soporta 2 candidatos. Para agregar un tercero:

```python
candidato3 = Candidato(
    nombre="Tercer Candidato",
    # ... configuración
)

db.session.add_all([candidato1, candidato2, candidato3])

# Y agregar sus respuestas del quiz
respuestas_candidato3 = [3, 3, 3, 3, 3, 3, 3, 3]
resp3 = RespuestaCandidato(pregunta_id=pregunta.id, candidato_id=3, posicion=respuestas_candidato3[i])
```

## Personalizar Preguntas del Quiz

Busca `preguntas_quiz` en la función `init_db()`:

```python
preguntas_quiz = [
    {"texto": "El Estado debe tener un rol principal en la economía", "categoria": "Economía", "orden": 1},
    {"texto": "Se deben aumentar los impuestos a los más ricos", "categoria": "Economía", "orden": 2},
    # Modifica o agrega más preguntas aquí
    {"texto": "Tu nueva pregunta aquí", "categoria": "Categoría", "orden": 9},
]
```

**Recuerda**: Si cambias el número de preguntas, debes actualizar las respuestas de todos los candidatos para que coincidan.
