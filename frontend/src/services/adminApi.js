import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

const adminApi = {
  // Configuración
  getConfig: () => axios.get(`${API_URL}/api/admin/config`),
  updateConfig: (data) => axios.put(`${API_URL}/api/admin/config`, data),

  // Candidatos
  getCandidatos: () => axios.get(`${API_URL}/api/admin/candidatos`),
  getCandidato: (id) => axios.get(`${API_URL}/api/admin/candidatos/${id}`),
  createCandidato: (data) => axios.post(`${API_URL}/api/admin/candidatos`, data),
  updateCandidato: (id, data) => axios.put(`${API_URL}/api/admin/candidatos/${id}`, data),
  deleteCandidato: (id) => axios.delete(`${API_URL}/api/admin/candidatos/${id}`),

  // Preguntas
  getPreguntas: () => axios.get(`${API_URL}/api/admin/preguntas`),
  createPregunta: (data) => axios.post(`${API_URL}/api/admin/preguntas`, data),
  updatePregunta: (id, data) => axios.put(`${API_URL}/api/admin/preguntas/${id}`, data),
  deletePregunta: (id) => axios.delete(`${API_URL}/api/admin/preguntas/${id}`),

  // Respuestas de candidatos
  getRespuestas: () => axios.get(`${API_URL}/api/admin/respuestas`),
  createRespuesta: (data) => axios.post(`${API_URL}/api/admin/respuestas`, data),

  // Estadísticas
  getStats: () => axios.get(`${API_URL}/api/admin/stats`),

  // Utilidades
  resetVotes: () => axios.post(`${API_URL}/api/admin/reset-votes`),
  resetNews: () => axios.post(`${API_URL}/api/admin/reset-news`),

  // Fuentes de noticias
  getFuentesNoticias: () => axios.get(`${API_URL}/api/admin/fuentes-noticias`),
  createFuenteNoticia: (data) => axios.post(`${API_URL}/api/admin/fuentes-noticias`, data),
  updateFuenteNoticia: (id, data) => axios.put(`${API_URL}/api/admin/fuentes-noticias/${id}`, data),
  deleteFuenteNoticia: (id) => axios.delete(`${API_URL}/api/admin/fuentes-noticias/${id}`),
};

export default adminApi;
