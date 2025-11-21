import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Comparador from './pages/Comparador'
import Quiz from './pages/Quiz'
import LineaTiempo from './pages/LineaTiempo'
import Votacion from './pages/Votacion'
import Resultados from './pages/Resultados'
import Noticias from './pages/Noticias'

// Admin Components
import Login from './pages/admin/Login'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import Candidatos from './pages/admin/Candidatos'
import Preguntas from './pages/admin/Preguntas'
import Configuracion from './pages/admin/Configuracion'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/comparar" element={<Comparador />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/linea-tiempo" element={<LineaTiempo />} />
                  <Route path="/noticias" element={<Noticias />} />
                  <Route path="/votar" element={<Votacion />} />
                  <Route path="/resultados" element={<Resultados />} />
                </Routes>
              </div>
            }
          />

          {/* Rutas de Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="candidatos" element={<Candidatos />} />
            <Route path="preguntas" element={<Preguntas />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
