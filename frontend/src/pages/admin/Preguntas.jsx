import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import adminApi from '../../services/adminApi';

const Preguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    texto: '',
    categoria: '',
    orden: 0
  });

  useEffect(() => {
    loadPreguntas();
  }, []);

  const loadPreguntas = async () => {
    try {
      const response = await adminApi.getPreguntas();
      setPreguntas(response.data);
    } catch (error) {
      console.error('Error loading preguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pregunta = null) => {
    if (pregunta) {
      setEditingId(pregunta.id);
      setFormData(pregunta);
    } else {
      setEditingId(null);
      const maxOrden = preguntas.length > 0
        ? Math.max(...preguntas.map(p => p.orden || 0))
        : 0;
      setFormData({
        texto: '',
        categoria: '',
        orden: maxOrden + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminApi.updatePregunta(editingId, formData);
      } else {
        await adminApi.createPregunta(formData);
      }
      loadPreguntas();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving pregunta:', error);
      alert('Error al guardar pregunta');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      try {
        await adminApi.deletePregunta(id);
        loadPreguntas();
      } catch (error) {
        console.error('Error deleting pregunta:', error);
        alert('Error al eliminar pregunta');
      }
    }
  };

  const categorias = [
    'Economía',
    'Educación',
    'Salud',
    'Seguridad',
    'Medio Ambiente',
    'Derechos Sociales',
    'Política',
    'Otro'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Preguntas del Quiz</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <FiPlus />
          <span>Agregar Pregunta</span>
        </button>
      </div>

      {/* Lista de Preguntas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pregunta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {preguntas.map((pregunta) => (
              <motion.tr
                key={pregunta.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pregunta.orden}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {pregunta.texto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {pregunta.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(pregunta)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(pregunta.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {preguntas.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No hay preguntas registradas</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Agregar la primera
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Editar Pregunta' : 'Nueva Pregunta'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Pregunta *
                  </label>
                  <textarea
                    value={formData.texto}
                    onChange={(e) =>
                      setFormData({ ...formData, texto: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                    placeholder="Escribe la pregunta aquí..."
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={formData.orden}
                    onChange={(e) =>
                      setFormData({ ...formData, orden: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    {editingId ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Preguntas;
