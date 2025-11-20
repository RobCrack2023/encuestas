import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaBalanceScale, FaClipboardList, FaClock, FaVoteYea, FaChartBar } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useElectionConfig } from '../hooks/useElectionConfig'

const Navbar = () => {
  const location = useLocation()
  const { config } = useElectionConfig()

  const navItems = [
    { path: '/', label: 'Inicio', icon: FaHome },
    { path: '/comparar', label: 'Comparar', icon: FaBalanceScale },
    { path: '/quiz', label: 'Quiz', icon: FaClipboardList },
    { path: '/linea-tiempo', label: 'Trayectoria', icon: FaClock },
    { path: '/votar', label: 'Votar', icon: FaVoteYea },
    { path: '/resultados', label: 'Resultados', icon: FaChartBar },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {config.title} {config.year}
            </div>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
