import { useState, useEffect } from 'react'
import './BudgetPage.css'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

function BudgetPage() {
  const { token } = useAuth()
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  // Charger les dépenses au chargement de la page
  useEffect(() => {
    fetch(`${API}/budgets`, { headers })
      .then(res => res.json())
      .then(data => setItems(data))
  }, [])

  // Ajouter une dépense
  function handleSubmit(e) {
    e.preventDefault()

    fetch(`${API}/budgets`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, amount: Number(amount), paid: false })
    })
      .then(res => res.json())
      .then(newItem => {
        setItems([...items, newItem])
        setTitle('')
        setAmount('')
      })
  }

  // Basculer le statut payé / non payé
  function handleTogglePaid(item) {
    fetch(`${API}/budgets/${item._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ paid: !item.paid })
    })
      .then(res => res.json())
      .then(updatedItem => {
        setItems(items.map(i => i._id === item._id ? updatedItem : i))
      })
  }

  // Supprimer une dépense
  function handleDelete(id) {
    fetch(`${API}/budgets/${id}`, { method: 'DELETE', headers })
      .then(() => setItems(items.filter(i => i._id !== id)))
  }

  // Calculer les totaux
  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const paid = items.reduce((sum, i) => i.paid ? sum + i.amount : sum, 0)

  return (
    <div>
      <h1>Budget</h1>

      {/* Résumé */}
      <div className="budget-summary">
        <div className="budget-card">
          <span className="budget-label">Total</span>
          <span className="budget-amount">{total} €</span>
        </div>
        <div className="budget-card">
          <span className="budget-label">Payé</span>
          <span className="budget-amount paid">{paid} €</span>
        </div>
        <div className="budget-card">
          <span className="budget-label">Restant</span>
          <span className="budget-amount remaining">{total - paid} €</span>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Intitulé (ex: Traiteur)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Montant (€)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des dépenses */}
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <strong>{item.title}</strong> — {item.amount} €
            <button onClick={() => handleTogglePaid(item)}>
              {item.paid ? 'Payé ✓' : 'Non payé'}
            </button>
            <button onClick={() => handleDelete(item._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BudgetPage
