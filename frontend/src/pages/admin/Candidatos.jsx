import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import adminApi from '../../services/adminApi';

const Candidatos = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    partido: '',
    foto_url: '',
    biografia: '',
    programa: {},
    linea_tiempo: []
  });

  useEffect(() => {
    loadCandidatos();
  }, []);

  const loadCandidatos = async () => {
    try {
      const response = await adminApi.getCandidatos();
      setCandidatos(response.data);
    } catch (error) {
      console.error('Error loading candidatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (candidato = null) => {
    if (candidato) {
      setEditingId(candidato.id);
      setFormData(candidato);
    } else {
      setEditingId(null);
      setFormData({
        nombre: '',
        partido: '',
        foto_url: '',
        biografia: '',
        programa: {},
        linea_tiempo: []
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
        await adminApi.updateCandidato(editingId, formData);
      } else {
        await adminApi.createCandidato(formData);
      }
      loadCandidatos();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving candidato:', error);
      alert('Error al guardar candidato');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este candidato?')) {
      try {
        await adminApi.deleteCandidato(id);
        loadCandidatos();
      } catch (error) {
        console.error('Error deleting candidato:', error);
        alert('Error al eliminar candidato');
      }
    }
  };

  const handleProgramaChange = (categoria, valor) => {
    setFormData({
      ...formData,
      programa: {
        ...formData.programa,
        [categoria]: valor
      }
    });
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Candidatos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
        >
          <FiPlus />
          <span>Agregar Candidato</span>
        </button>
      </div>

      {/* Lista de Candidatos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidatos.map((candidato) => (
          <motion.div
            key={candidato.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {candidato.foto_url && (
              <img
                src={candidato.foto_url}
                alt={candidato.nombre}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800">{candidato.nombre}</h3>
              <p className="text-gray-600">{candidato.partido}</p>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                {candidato.biografia}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleOpenModal(candidato)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded flex items-center justify-center space-x-1 transition"
                >
                  <FiEdit2 size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(candidato.id)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded flex items-center justify-center space-x-1 transition"
                >
                  <FiTrash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {candidatos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No hay candidatos registrados</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Agregar el primero
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingId ? 'Editar Candidato' : 'Nuevo Candidato'}
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
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Partido
                  </label>
                  <input
                    type="text"
                    value={formData.partido}
                    onChange={(e) =>
                      setFormData({ ...formData, partido: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    URL de Foto
                  </label>
                  <input
                    type="text"
                    value={formData.foto_url}
                    onChange={(e) =>
                      setFormData({ ...formData, foto_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="/images/candidato.jpg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Biografía
                  </label>
                  <textarea
                    value={formData.biografia}
                    onChange={(e) =>
                      setFormData({ ...formData, biografia: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Programa (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.programa, null, 2)}
                    onChange={(e) => {
                      try {
                        setFormData({
                          ...formData,
                          programa: JSON.parse(e.target.value)
                        });
                      } catch (err) {
                        // Invalid JSON, do nothing
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    rows="6"
                    placeholder='{"Economía": "...", "Salud": "..."}'
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

export default Candidatos;
