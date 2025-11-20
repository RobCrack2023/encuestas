import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FaBalanceScale } from 'react-icons/fa'

const Comparador = () => {
  const [comparacion, setComparacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    fetchComparacion()
  }, [])

  const fetchComparacion = async () => {
    try {
      const response = await axios.get('/api/comparar')
      setComparacion(response.data)
      if (response.data.programas) {
        setSelectedCategory(Object.keys(response.data.programas)[0])
      }
    } catch (error) {
      console.error('Error al cargar comparación:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!comparacion) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-600">No se pudo cargar la comparación</p>
      </div>
    )
  }

  const categorias = Object.keys(comparacion.programas || {})
  const candidato1 = comparacion.candidatos[0]
  const candidato2 = comparacion.candidatos[1]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center mb-4">
          <FaBalanceScale className="text-5xl text-blue-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comparador de Candidatos
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Compara las propuestas de ambos candidatos lado a lado en diferentes temas
        </p>
      </motion.div>

      {/* Candidatos Header */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {candidato1.nombre.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{candidato1.nombre}</h2>
          <p className="text-gray-600">{candidato1.partido}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {candidato2.nombre.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{candidato2.nombre}</h2>
          <p className="text-gray-600">{candidato2.partido}</p>
        </motion.div>
      </div>

      {/* Selector de Categorías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Selecciona un Tema
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categorias.map((cat, index) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow hover:shadow-lg border-2 border-gray-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Comparación de Propuestas */}
      {selectedCategory && (
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                {candidato1.nombre.charAt(0)}
              </div>
              <h4 className="text-xl font-bold text-gray-800">{candidato1.nombre}</h4>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-inner">
              <p className="text-gray-700 leading-relaxed">
                {comparacion.programas[selectedCategory][candidato1.nombre]}
              </p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                {candidato2.nombre.charAt(0)}
              </div>
              <h4 className="text-xl font-bold text-gray-800">{candidato2.nombre}</h4>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-inner">
              <p className="text-gray-700 leading-relaxed">
                {comparacion.programas[selectedCategory][candidato2.nombre]}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-600 italic">
          La información presentada es una síntesis de las propuestas públicas de cada candidato
        </p>
      </motion.div>
    </div>
  )
}

export default Comparador
