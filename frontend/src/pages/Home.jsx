import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBalanceScale, FaClipboardList, FaClock, FaVoteYea } from 'react-icons/fa'

const Home = () => {
  const features = [
    {
      icon: FaBalanceScale,
      title: 'Compara Candidatos',
      description: 'Visualiza y compara las propuestas de ambos candidatos lado a lado',
      link: '/comparar',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FaClipboardList,
      title: 'Quiz de Afinidad',
      description: 'Descubre qué candidato se alinea mejor con tus valores políticos',
      link: '/quiz',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: FaClock,
      title: 'Línea de Tiempo',
      description: 'Conoce la trayectoria política de cada candidato',
      link: '/linea-tiempo',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: FaVoteYea,
      title: 'Vota Ahora',
      description: 'Participa en nuestra encuesta y ve los resultados en tiempo real',
      link: '/votar',
      color: 'from-green-500 to-green-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Elecciones Presidenciales Chile 2024
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Infórmate, compara y decide. Conoce en profundidad las propuestas de cada candidato
          y participa en nuestra encuesta interactiva.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div key={index} variants={itemVariants}>
              <Link to={feature.link}>
                <div className="card-hover h-full flex flex-col items-center text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {feature.description}
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold hover:text-purple-600 transition-colors">
                    Explorar →
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          ¿Listo para participar?
        </h2>
        <p className="text-xl text-white mb-6 opacity-90">
          Tu voz importa. Participa en nuestra encuesta y comparte tu opinión.
        </p>
        <Link to="/votar">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            Votar Ahora
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
            <div className="text-gray-600">Candidatos</div>
          </div>
          <div className="card">
            <div className="text-4xl font-bold text-purple-600 mb-2">8</div>
            <div className="text-gray-600">Preguntas de Quiz</div>
          </div>
          <div className="card">
            <div className="text-4xl font-bold text-pink-600 mb-2">∞</div>
            <div className="text-gray-600">Información Valiosa</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
