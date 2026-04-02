import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

function GuestsPage() {
  const { token } = useAuth()
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const [guests, setGuests] = useState([])
  const [weddings, setWeddings] = useState([])
  const [name, setName] = useState('')
  const [status, setStatus] = useState('invité')
  const [weddingId, setWeddingId] = useState('')

  // Charger les invités et les mariages au chargement de la page
  useEffect(() => {
    fetch(`${API}/guests`, { headers })
      .then(res => res.json())
      .then(data => setGuests(data))

    fetch(`${API}/weddings`, { headers })
      .then(res => res.json())
      .then(data => {
        setWeddings(data)
        if (data.length > 0) setWeddingId(data[0]._id)
      })
  }, [])

  // Créer un nouvel invité lié à un mariage
  function handleSubmit(e) {
    e.preventDefault()

    fetch(`${API}/guests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, status, weddingId })
    })
      .then(res => res.json())
      .then(newGuest => {
        setGuests([...guests, newGuest])
        setName('')
        setStatus('invité')
      })
  }

  // Changer le statut d'un invité existant
  function handleStatusChange(id, newStatus) {
    fetch(`${API}/guests/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(updatedGuest => {
        setGuests(guests.map(g => g._id === id ? updatedGuest : g))
      })
  }

  // Trouver le nom du mariage lié à un invité
  function getWeddingName(id) {
    const wedding = weddings.find(w => w._id === id)
    return wedding ? wedding.name : '—'
  }

  return (
    <div>
      <h1>Invités</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de l'invité"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select value={weddingId} onChange={e => setWeddingId(e.target.value)} required>
          {weddings.length === 0 && <option value="">Aucun mariage disponible</option>}
          {weddings.map(w => (
            <option key={w._id} value={w._id}>{w.name}</option>
          ))}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="invité">Invité</option>
          <option value="confirmé">Confirmé</option>
          <option value="annulé">Annulé</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des invités */}
      <ul>
        {guests.map(guest => (
          <li key={guest._id}>
            <strong>{guest.name}</strong> — Mariage : {getWeddingName(guest.weddingId)} —
            <select
              value={guest.status}
              onChange={e => handleStatusChange(guest._id, e.target.value)}
            >
              <option value="invité">Invité</option>
              <option value="confirmé">Confirmé</option>
              <option value="annulé">Annulé</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GuestsPage
