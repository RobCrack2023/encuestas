import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { FaClipboardList, FaCheckCircle } from 'react-icons/fa'

const Quiz = () => {
  const [preguntas, setPreguntas] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [resultados, setResultados] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPreguntas()
  }, [])

  const fetchPreguntas = async () => {
    try {
      const response = await axios.get('/api/quiz/preguntas')
      setPreguntas(response.data)
    } catch (error) {
      console.error('Error al cargar preguntas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (preguntaId, posicion) => {
    setRespuestas({ ...respuestas, [preguntaId]: posicion })
  }

  const calcularAfinidad = async () => {
    const respuestasArray = Object.entries(respuestas).map(([pregunta_id, posicion]) => ({
      pregunta_id: parseInt(pregunta_id),
      posicion: posicion,
    }))

    try {
      const response = await axios.post('/api/quiz/calcular', {
        respuestas: respuestasArray,
      })
      setResultados(response.data)
    } catch (error) {
      console.error('Error al calcular afinidad:', error)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < preguntas.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calcularAfinidad()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setRespuestas({})
    setResultados(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    )
  }

  if (resultados) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resultados de tu Quiz de Afinidad
            </h2>

            <div className="space-y-6 mb-8">
              {resultados.map((resultado, index) => (
                <motion.div
                  key={resultado.candidato_id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {resultado.nombre}
                    </h3>
                    <span className="text-2xl font-bold text-purple-600">
                      {resultado.afinidad}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resultado.afinidad}%` }}
                      transition={{ delay: index * 0.2 + 0.3, duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        index === 0
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gradient-to-r from-pink-500 to-orange-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-gray-600 mb-6">
              Basado en tus respuestas, tu mayor afinidad es con{' '}
              <span className="font-bold text-purple-600">{resultados[0].nombre}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="btn-primary"
              >
                Reintentar Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = '/comparar')}
                className="btn-secondary"
              >
                Comparar Candidatos
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const pregunta = preguntas[currentQuestion]
  const progress = ((currentQuestion + 1) / preguntas.length) * 100

  const opciones = [
    { valor: 1, texto: 'Muy en desacuerdo', color: 'from-red-500 to-red-600' },
    { valor: 2, texto: 'En desacuerdo', color: 'from-orange-500 to-orange-600' },
    { valor: 3, texto: 'Neutral', color: 'from-gray-500 to-gray-600' },
    { valor: 4, texto: 'De acuerdo', color: 'from-blue-500 to-blue-600' },
    { valor: 5, texto: 'Muy de acuerdo', color: 'from-green-500 to-green-600' },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <FaClipboardList className="text-5xl text-purple-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quiz de Afinidad Política
          </h1>
        </div>
        <p className="text-xl text-gray-600">
          Responde estas preguntas y descubre con qué candidato tienes mayor afinidad
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Pregunta {currentQuestion + 1} de {preguntas.length}
          </span>
          <span className="text-sm font-semibold text-purple-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="progress-bar"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                {pregunta.categoria}
              </span>
              <h3 className="text-2xl font-bold text-gray-800">
                {pregunta.texto}
              </h3>
            </div>

            <div className="space-y-4">
              {opciones.map((opcion) => {
                const isSelected = respuestas[pregunta.id] === opcion.valor

                return (
                  <motion.button
                    key={opcion.valor}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(pregunta.id, opcion.valor)}
                    className={`w-full p-4 rounded-lg text-left font-semibold transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-r ${opcion.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opcion.texto}</span>
                      {isSelected && <FaCheckCircle className="text-white text-xl" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-secondary'
                }`}
              >
                ← Anterior
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                disabled={!respuestas[pregunta.id]}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  !respuestas[pregunta.id]
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {currentQuestion === preguntas.length - 1 ? 'Ver Resultados' : 'Siguiente →'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Quiz
