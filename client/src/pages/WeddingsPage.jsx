import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

function WeddingsPage() {
  const { token } = useAuth()
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const [weddings, setWeddings] = useState([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  // Charger les mariages depuis l'API au chargement de la page
  useEffect(() => {
    fetch(`${API}/weddings`, { headers })
      .then(res => res.json())
      .then(data => setWeddings(data))
  }, [])

  // Créer un nouveau mariage
  function handleSubmit(e) {
    e.preventDefault()

    fetch(`${API}/weddings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, date, location })
    })
      .then(res => res.json())
      .then(newWedding => {
        setWeddings([...weddings, newWedding])
        setName('')
        setDate('')
        setLocation('')
      })
  }

  return (
    <div>
      <h1>Mariages</h1>

      {/* Formulaire de création */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du mariage"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lieu"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des mariages */}
      <ul>
        {weddings.map(wedding => (
          <li key={wedding._id}>
            <strong>{wedding.name}</strong> — {new Date(wedding.date).toLocaleDateString('fr-FR')} — {wedding.location}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WeddingsPage
