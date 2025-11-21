import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FiUsers, FiHelpCircle, FiCheckSquare, FiFileText } from 'react-icons/fi';
import adminApi from '../../services/adminApi';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminApi.getStats();
      setStats(response.data);
    } catch (error) {
      setError('Error al cargar estadísticas');
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats?.votos_por_candidato
    ? {
        labels: stats.votos_por_candidato.map((v) => v.candidato),
        datasets: [
          {
            label: 'Votos',
            data: stats.votos_por_candidato.map((v) => v.votos),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Votos por Candidato',
      },
    },
  };

  const statCards = [
    {
      title: 'Candidatos',
      value: stats?.total_candidatos || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Preguntas',
      value: stats?.total_preguntas || 0,
      icon: FiHelpCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Votos',
      value: stats?.total_votos || 0,
      icon: FiCheckSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Noticias',
      value: stats?.total_noticias || 0,
      icon: FiFileText,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {chartData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <Bar data={chartData} options={chartOptions} />
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/candidatos'}
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <FiUsers className="text-blue-600 mb-2" size={24} />
            <p className="font-medium text-gray-800">Gestionar Candidatos</p>
            <p className="text-sm text-gray-600">Agregar, editar o eliminar</p>
          </button>
          <button
            onClick={() => window.location.href = '/admin/preguntas'}
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
          >
            <FiHelpCircle className="text-green-600 mb-2" size={24} />
            <p className="font-medium text-gray-800">Gestionar Preguntas</p>
            <p className="text-sm text-gray-600">Crear o modificar quiz</p>
          </button>
          <button
            onClick={() => window.location.href = '/admin/configuracion'}
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
          >
            <FiUsers className="text-purple-600 mb-2" size={24} />
            <p className="font-medium text-gray-800">Configuración</p>
            <p className="text-sm text-gray-600">Ajustar parámetros</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
