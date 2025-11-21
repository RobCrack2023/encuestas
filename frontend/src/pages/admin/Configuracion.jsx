import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import adminApi from '../../services/adminApi';

const Configuracion = () => {
  const [config, setConfig] = useState({
    election_year: '',
    election_title: '',
    election_type: '',
    site_name: '',
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await adminApi.getConfig();
      setConfig(response.data);
    } catch (error) {
      console.error('Error loading config:', error);
      setMessage({
        type: 'error',
        text: 'Error al cargar la configuración'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await adminApi.updateConfig(config);
      setMessage({
        type: 'success',
        text: 'Configuración actualizada correctamente'
      });
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage({
        type: 'error',
        text: 'Error al guardar la configuración'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetVotes = async () => {
    if (window.confirm('¿Estás seguro de reiniciar TODOS los votos? Esta acción no se puede deshacer.')) {
      try {
        await adminApi.resetVotes();
        setMessage({
          type: 'success',
          text: 'Votos reiniciados correctamente'
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Error resetting votes:', error);
        setMessage({
          type: 'error',
          text: 'Error al reiniciar los votos'
        });
      }
    }
  };

  const handleResetNews = async () => {
    if (window.confirm('¿Estás seguro de eliminar TODAS las noticias? Esta acción no se puede deshacer.')) {
      try {
        await adminApi.resetNews();
        setMessage({
          type: 'success',
          text: 'Noticias eliminadas correctamente'
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Error resetting news:', error);
        setMessage({
          type: 'error',
          text: 'Error al eliminar las noticias'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h1>

      {/* Mensaje de éxito/error */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center space-x-2 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <FiCheckCircle size={20} />
          ) : (
            <FiAlertCircle size={20} />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Formulario de Configuración General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Configuración General
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Año de Elección
              </label>
              <input
                type="text"
                value={config.election_year}
                onChange={(e) =>
                  setConfig({ ...config, election_year: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tipo de Elección
              </label>
              <input
                type="text"
                value={config.election_type}
                onChange={(e) =>
                  setConfig({ ...config, election_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Presidenciales"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Título de Elección
            </label>
            <input
              type="text"
              value={config.election_title}
              onChange={(e) =>
                setConfig({ ...config, election_title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Elecciones Presidenciales Chile"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={config.site_name}
              onChange={(e) =>
                setConfig({ ...config, site_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Sistema de Encuestas"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="maintenance"
              checked={config.maintenance_mode}
              onChange={(e) =>
                setConfig({ ...config, maintenance_mode: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="maintenance" className="text-gray-700 font-medium">
              Modo Mantenimiento
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <FiSave />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </form>
      </motion.div>

      {/* Acciones Peligrosas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Zona de Peligro
        </h2>
        <p className="text-gray-600 mb-6">
          Estas acciones son irreversibles. Úsalas con precaución.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Reiniciar Votos</h3>
              <p className="text-sm text-gray-600">
                Elimina todos los votos registrados en el sistema
              </p>
            </div>
            <button
              onClick={handleResetVotes}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Reiniciar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Eliminar Noticias</h3>
              <p className="text-sm text-gray-600">
                Elimina todas las noticias almacenadas
              </p>
            </div>
            <button
              onClick={handleResetNews}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Configuracion;
