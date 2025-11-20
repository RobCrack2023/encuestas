import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FaNewspaper, FaSync, FaExternalLinkAlt, FaClock } from 'react-icons/fa'

const Noticias = () => {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fuentes, setFuentes] = useState([])
  const [selectedSource, setSelectedSource] = useState(null)

  useEffect(() => {
    fetchNoticias()
    fetchFuentes()
  }, [selectedSource])

  const fetchNoticias = async () => {
    setLoading(true)
    try {
      const params = selectedSource ? { source: selectedSource } : {}
      const response = await axios.get('/api/noticias', { params })
      setNoticias(response.data)
    } catch (error) {
      console.error('Error al cargar noticias:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFuentes = async () => {
    try {
      const response = await axios.get('/api/noticias/fuentes')
      setFuentes(response.data)
    } catch (error) {
      console.error('Error al cargar fuentes:', error)
    }
  }

  const actualizarNoticias = async () => {
    setUpdating(true)
    try {
      const response = await axios.post('/api/noticias/actualizar')
      alert(`${response.data.nuevas} noticias nuevas agregadas`)
      fetchNoticias()
    } catch (error) {
      alert('Error al actualizar noticias')
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recientemente'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Hace menos de 1 hora'
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`
    return date.toLocaleDateString('es-CL')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
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
          <FaNewspaper className="text-5xl text-orange-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Noticias Políticas
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Mantente informado con las últimas noticias sobre las elecciones
        </p>

        {/* Botón Actualizar */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={actualizarNoticias}
          disabled={updating}
          className="btn-secondary inline-flex items-center"
        >
          <FaSync className={`mr-2 ${updating ? 'animate-spin' : ''}`} />
          {updating ? 'Actualizando...' : 'Actualizar Noticias'}
        </motion.button>
      </motion.div>

      {/* Filtros por Fuente */}
      {fuentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
            Filtrar por Fuente
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSource(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                !selectedSource
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow border-2 border-gray-200'
              }`}
            >
              Todas
            </motion.button>
            {fuentes.map((fuente) => (
              <motion.button
                key={fuente.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSource(fuente.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedSource === fuente.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 shadow border-2 border-gray-200'
                }`}
              >
                {fuente.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Grid de Noticias */}
      {noticias.length === 0 ? (
        <div className="text-center py-12">
          <FaNewspaper className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            No hay noticias disponibles
          </h3>
          <p className="text-gray-500 mb-6">
            Haz clic en "Actualizar Noticias" para obtener las últimas noticias
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {noticias.map((noticia, index) => (
            <motion.a
              key={noticia.id}
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              className="block"
            >
              <div className="card-hover h-full flex flex-col">
                {/* Imagen */}
                {noticia.image_url && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg mb-4">
                    <img
                      src={noticia.image_url}
                      alt={noticia.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                {/* Fuente y Fecha */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-orange-600">
                    {noticia.source}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <FaClock className="mr-1" />
                    {formatDate(noticia.published_at)}
                  </span>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-3 flex-grow">
                  {noticia.title}
                </h3>

                {/* Resumen */}
                {noticia.summary && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {noticia.summary}
                  </p>
                )}

                {/* Link */}
                <div className="flex items-center text-orange-600 font-semibold hover:text-red-600 transition-colors">
                  <span>Leer más</span>
                  <FaExternalLinkAlt className="ml-2 text-sm" />
                </div>
              </div>
            </motion.a>
          ))}
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
          Las noticias se obtienen automáticamente de fuentes confiables de medios chilenos
        </p>
      </motion.div>
    </div>
  )
}

export default Noticias
