import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaVoteYea, FaCheckCircle } from 'react-icons/fa'

const Votacion = () => {
  const [candidatos, setCandidatos] = useState([])
  const [selectedCandidato, setSelectedCandidato] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCandidatos()
    checkIfVoted()
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

  const checkIfVoted = () => {
    const hasVoted = localStorage.getItem('hasVoted')
    if (hasVoted) {
      setVoted(true)
    }
  }

  const generateIpHash = () => {
    // Generar un hash único para la sesión
    const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36).substring(7)
    localStorage.setItem('sessionId', sessionId)
    return sessionId
  }

  const handleVote = async () => {
    if (!selectedCandidato) return

    setVoting(true)
    setError(null)

    try {
      const ipHash = generateIpHash()
      await axios.post('/api/votar', {
        candidato_id: selectedCandidato,
        ip_hash: ipHash,
      })

      localStorage.setItem('hasVoted', 'true')
      setVoted(true)

      // Redirigir a resultados después de 2 segundos
      setTimeout(() => {
        navigate('/resultados')
      }, 2000)
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Ya has votado anteriormente')
        setVoted(true)
      } else {
        setError('Error al registrar el voto. Inténtalo de nuevo.')
      }
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    )
  }

  if (voted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="card">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              ¡Voto Registrado!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Gracias por participar en nuestra encuesta
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/resultados')}
              className="btn-primary"
            >
              Ver Resultados
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <FaVoteYea className="text-5xl text-green-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Emite tu Voto
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Selecciona tu candidato preferido y participa en nuestra encuesta
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </motion.div>
      )}

      {/* Candidatos Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
        {candidatos.map((candidato, index) => {
          const isSelected = selectedCandidato === candidato.id
          const colors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
          ]

          return (
            <motion.div
              key={candidato.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCandidato(candidato.id)}
                className={`w-full text-left transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-green-500 shadow-2xl'
                    : 'shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="card h-full relative">
                  {/* Checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-green-500 rounded-full p-2"
                    >
                      <FaCheckCircle className="text-2xl text-white" />
                    </motion.div>
                  )}

                  {/* Avatar */}
                  <div
                    className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${colors[index]} flex items-center justify-center text-white text-5xl font-bold shadow-lg`}
                  >
                    {candidato.nombre.charAt(0)}
                  </div>

                  {/* Info */}
                  <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
                    {candidato.nombre}
                  </h3>
                  <p className="text-center text-gray-600 mb-4">
                    {candidato.partido}
                  </p>

                  {/* Programa resumido */}
                  {candidato.programa && (
                    <div className="space-y-2">
                      {Object.entries(candidato.programa)
                        .slice(0, 3)
                        .map(([key, value], idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="font-semibold text-sm text-gray-700 mb-1">
                              {key}
                            </div>
                            <div className="text-xs text-gray-600 line-clamp-2">
                              {value}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )
        })}
      </div>

      {/* Vote Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: selectedCandidato ? 1.05 : 1 }}
          whileTap={{ scale: selectedCandidato ? 0.95 : 1 }}
          onClick={handleVote}
          disabled={!selectedCandidato || voting}
          className={`px-12 py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
            selectedCandidato && !voting
              ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-xl hover:shadow-2xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {voting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
              Registrando voto...
            </div>
          ) : (
            'Confirmar Voto'
          )}
        </motion.button>

        {!selectedCandidato && (
          <p className="text-gray-500 mt-4">
            Selecciona un candidato para continuar
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default Votacion
