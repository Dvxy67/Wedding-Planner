import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

function VendorsPage() {
  const { token } = useAuth()
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const [vendors, setVendors] = useState([])
  const [weddings, setWeddings] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [contact, setContact] = useState('')
  const [weddingId, setWeddingId] = useState('')

  // Charger les prestataires et les mariages au chargement de la page
  useEffect(() => {
    fetch(`${API}/vendors`, { headers })
      .then(res => res.json())
      .then(data => setVendors(data))

    fetch(`${API}/weddings`, { headers })
      .then(res => res.json())
      .then(data => {
        setWeddings(data)
        if (data.length > 0) setWeddingId(data[0]._id)
      })
  }, [])

  // Créer un nouveau prestataire lié à un mariage
  function handleSubmit(e) {
    e.preventDefault()

    fetch(`${API}/vendors`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, type, contact, weddingId })
    })
      .then(res => res.json())
      .then(newVendor => {
        setVendors([...vendors, newVendor])
        setName('')
        setType('')
        setContact('')
      })
  }

  // Supprimer un prestataire
  function handleDelete(id) {
    fetch(`${API}/vendors/${id}`, { method: 'DELETE', headers })
      .then(() => {
        setVendors(vendors.filter(v => v._id !== id))
      })
  }

  // Trouver le nom du mariage lié à un prestataire
  function getWeddingName(id) {
    const wedding = weddings.find(w => w._id === id)
    return wedding ? wedding.name : '—'
  }

  return (
    <div>
      <h1>Prestataires</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom du prestataire"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Type (ex: traiteur, photographe...)"
          value={type}
          onChange={e => setType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact (email ou téléphone)"
          value={contact}
          onChange={e => setContact(e.target.value)}
        />
        <select value={weddingId} onChange={e => setWeddingId(e.target.value)} required>
          {weddings.length === 0 && <option value="">Aucun mariage disponible</option>}
          {weddings.map(w => (
            <option key={w._id} value={w._id}>{w.name}</option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des prestataires */}
      <ul>
        {vendors.map(vendor => (
          <li key={vendor._id}>
            <strong>{vendor.name}</strong> — {vendor.type}
            {vendor.contact && <span> — {vendor.contact}</span>}
            {' '}— Mariage : {getWeddingName(vendor.weddingId)}
            <button onClick={() => handleDelete(vendor._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VendorsPage
