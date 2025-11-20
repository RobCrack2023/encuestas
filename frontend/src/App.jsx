import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Comparador from './pages/Comparador'
import Quiz from './pages/Quiz'
import LineaTiempo from './pages/LineaTiempo'
import Votacion from './pages/Votacion'
import Resultados from './pages/Resultados'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comparar" element={<Comparador />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/linea-tiempo" element={<LineaTiempo />} />
          <Route path="/votar" element={<Votacion />} />
          <Route path="/resultados" element={<Resultados />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
