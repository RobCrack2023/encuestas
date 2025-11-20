import { useState, useEffect } from 'react'
import axios from 'axios'

export const useElectionConfig = () => {
  const [config, setConfig] = useState({
    year: '2024',
    title: 'Elecciones Presidenciales Chile',
    type: 'Presidenciales'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/api/config')
        setConfig(response.data)
      } catch (error) {
        console.error('Error al cargar configuración:', error)
        // Mantener valores por defecto si falla
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, loading }
}
