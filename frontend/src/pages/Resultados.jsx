import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { FaChartBar, FaSync } from 'react-icons/fa'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const Resultados = () => {
  const [resultados, setResultados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchResultados()
    // Auto-refresh cada 30 segundos
    const interval = setInterval(() => {
      fetchResultados(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchResultados = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true)
    else setRefreshing(true)

    try {
      const response = await axios.get('/api/resultados')
      setResultados(response.data)
    } catch (error) {
      console.error('Error al cargar resultados:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchResultados()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    )
  }

  if (!resultados || resultados.total_votos === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center card">
          <FaChartBar className="text-6xl text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No hay votos registrados aún
          </h2>
          <p className="text-xl text-gray-600">
            Sé el primero en participar en nuestra encuesta
          </p>
        </div>
      </div>
    )
  }

  // Preparar datos para los gráficos
  const pieData = {
    labels: resultados.resultados.map((r) => r.nombre),
    datasets: [
      {
        data: resultados.resultados.map((r) => r.porcentaje),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(168, 85, 247, 0.8)',  // Purple
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: resultados.resultados.map((r) => r.nombre),
    datasets: [
      {
        label: 'Número de Votos',
        data: resultados.resultados.map((r) => r.votos),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: 'system-ui',
          },
          padding: 20,
        },
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
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
          <FaChartBar className="text-5xl text-blue-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Resultados en Tiempo Real
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Visualiza cómo va la votación en nuestra encuesta
        </p>

        {/* Refresh Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary inline-flex items-center"
        >
          <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualizando...' : 'Actualizar Resultados'}
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h3 className="text-xl font-semibold mb-2 opacity-90">
            Total de Votos Registrados
          </h3>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="text-6xl font-bold"
          >
            {resultados.total_votos}
          </motion.div>
        </div>
      </motion.div>

      {/* Resultados Detallados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="grid md:grid-cols-2 gap-8">
          {resultados.resultados.map((resultado, index) => {
            const colors = [
              { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-50' },
              { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-50' },
            ]
            const color = colors[index]

            return (
              <motion.div
                key={resultado.candidato_id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                className={`card ${color.bg}`}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {resultado.nombre}
                </h3>

                {/* Porcentaje */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Porcentaje</span>
                    <span className={`text-3xl font-bold bg-gradient-to-r ${color.from} ${color.to} bg-clip-text text-transparent`}>
                      {resultado.porcentaje}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${resultado.porcentaje}%` }}
                      transition={{ delay: 0.8 + index * 0.2, duration: 1, ease: 'easeOut' }}
                      className={`h-full bg-gradient-to-r ${color.from} ${color.to} flex items-center justify-end pr-2`}
                    >
                      <span className="text-white text-xs font-bold">
                        {resultado.porcentaje > 10 && `${resultado.porcentaje}%`}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Votos */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Votos</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {resultado.votos}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Gráficos */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Visualización de Datos
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gráfico de Torta */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Distribución Porcentual
            </h3>
            <div className="max-w-md mx-auto">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Comparación de Votos
            </h3>
            <div className="max-w-md mx-auto">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-4xl mx-auto mt-12 text-center"
      >
        <p className="text-gray-600 italic">
          Los resultados se actualizan automáticamente cada 30 segundos.
          Esta es una encuesta informal y no representa resultados oficiales.
        </p>
      </motion.div>
    </div>
  )
}

export default Resultados
