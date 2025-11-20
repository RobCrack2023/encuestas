import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FaClock, FaCalendarAlt } from 'react-icons/fa'

const LineaTiempo = () => {
  const [candidatos, setCandidatos] = useState([])
  const [selectedCandidato, setSelectedCandidato] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidatos()
  }, [])

  const fetchCandidatos = async () => {
    try {
      const response = await axios.get('/api/candidatos')
      setCandidatos(response.data)
    } catch (error) {
      console.error('Error al cargar candidatos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600"></div>
      </div>
    )
  }

  const candidato = candidatos[selectedCandidato]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <FaClock className="text-5xl text-pink-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Trayectoria Política
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Conoce la historia y el recorrido político de cada candidato
        </p>
      </motion.div>

      {/* Selector de Candidato */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4 mb-12"
      >
        {candidatos.map((cand, index) => (
          <motion.button
            key={cand.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCandidato(index)}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedCandidato === index
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl'
                : 'bg-white text-gray-700 shadow-lg hover:shadow-xl border-2 border-gray-200'
            }`}
          >
            {cand.nombre}
          </motion.button>
        ))}
      </motion.div>

      {/* Biografía */}
      <motion.div
        key={`bio-${selectedCandidato}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="card">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mr-6 shadow-lg">
              {candidato.nombre.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {candidato.nombre}
              </h2>
              <p className="text-xl text-gray-600">{candidato.partido}</p>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {candidato.biografia}
          </p>
        </div>
      </motion.div>

      {/* Línea de Tiempo */}
      <motion.div
        key={`timeline-${selectedCandidato}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Hitos Importantes
        </h3>

        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-500 to-purple-600"></div>

          {/* Eventos */}
          {candidato.linea_tiempo && candidato.linea_tiempo.map((evento, index) => {
            const isLeft = index % 2 === 0

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                className={`relative mb-12 ${
                  isLeft ? 'pr-1/2 text-right' : 'pl-1/2 text-left'
                }`}
              >
                <div className={`flex items-center ${isLeft ? 'justify-end' : 'justify-start'}`}>
                  {/* Contenido */}
                  <div
                    className={`w-5/12 ${
                      isLeft ? 'pr-8' : 'pl-8'
                    } relative`}
                  >
                    <div className="card bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 hover:border-purple-400 transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <FaCalendarAlt className="text-pink-600 mr-3 text-xl" />
                        <span className="text-2xl font-bold text-pink-600">
                          {evento.año}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {evento.evento}
                      </p>
                    </div>

                    {/* Conector al círculo central */}
                    <div
                      className={`absolute top-1/2 ${
                        isLeft ? 'right-0' : 'left-0'
                      } w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-500`}
                    />
                  </div>

                  {/* Círculo central */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Nota final */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="max-w-4xl mx-auto mt-12 text-center"
      >
        <p className="text-gray-600 italic">
          Esta línea de tiempo muestra los hitos más importantes de la carrera política del candidato
        </p>
      </motion.div>
    </div>
  )
}

export default LineaTiempo
