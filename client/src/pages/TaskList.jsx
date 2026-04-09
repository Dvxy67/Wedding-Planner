import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

function TaskList() {
  const { token } = useAuth()
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }

  const [tasks, setTasks] = useState([])
  const [weddings, setWeddings] = useState([])

  // Champs du formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('à faire')
  const [weddingId, setWeddingId] = useState('')

  // Tâche en cours de modification
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editWeddingId, setEditWeddingId] = useState('')

  // Charger les tâches et les mariages au montage
  useEffect(() => {
    fetch(`${API}/tasks`, { headers })
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(err => console.error('Erreur chargement tâches:', err))

    fetch(`${API}/weddings`, { headers })
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setWeddings(list)
        if (list.length > 0) setWeddingId(list[0]._id)
      })
      .catch(err => console.error('Erreur chargement mariages:', err))
  }, [])

  // Créer une nouvelle tâche
  function handleSubmit(e) {
    e.preventDefault()
    if (!weddingId) {
      alert('Aucun mariage disponible. Créez d\'abord un mariage.')
      return
    }
    fetch(`${API}/tasks`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, description, status, wedding: weddingId })
    })
      .then(res => res.json())
      .then(newTask => {
        if (newTask._id) {
          setTasks([...tasks, newTask])
          setTitle('')
          setDescription('')
          setStatus('à faire')
        } else {
          console.error('Erreur création tâche:', newTask)
          alert('Erreur : ' + (newTask.message || 'inconnue'))
        }
      })
      .catch(err => console.error('Erreur POST tâche:', err))
  }

  // Ouvrir le formulaire d'édition
  function startEdit(task) {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditStatus(task.status)
    setEditWeddingId(task.wedding?._id || '')
  }

  // Sauvegarder les modifications
  function handleUpdate(e) {
    e.preventDefault()
    fetch(`${API}/tasks/${editingId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
        status: editStatus,
        wedding: editWeddingId
      })
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(tasks.map(t => t._id === editingId ? updatedTask : t))
        setEditingId(null)
      })
  }

  // Supprimer une tâche
  function handleDelete(id) {
    fetch(`${API}/tasks/${id}`, { method: 'DELETE', headers })
      .then(() => setTasks(tasks.filter(t => t._id !== id)))
  }

  const statusOptions = ['à faire', 'en cours', 'terminé']

  return (
    <div>
      <h1>Tâches</h1>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre de la tâche"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={weddingId} onChange={e => setWeddingId(e.target.value)} required>
          {weddings.length === 0
            ? <option value="">Aucun mariage disponible</option>
            : weddings.map(w => <option key={w._id} value={w._id}>{w.name}</option>)
          }
        </select>
        <button type="submit">Ajouter</button>
      </form>

      {/* Liste des tâches */}
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {editingId === task._id ? (
              // Formulaire d'édition inline
              <form onSubmit={handleUpdate}>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
                <input
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={editWeddingId} onChange={e => setEditWeddingId(e.target.value)}>
                  {weddings.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                </select>
                <button type="submit">Sauvegarder</button>
                <button type="button" onClick={() => setEditingId(null)}>Annuler</button>
              </form>
            ) : (
              // Affichage normal
              <>
                <strong>{task.title}</strong>
                {task.description && ` — ${task.description}`}
                {' — '}
                <em>{task.status}</em>
                {' — Mariage : '}
                {task.wedding?.name || '—'}
                {' '}
                <button onClick={() => startEdit(task)}>Modifier</button>
                <button onClick={() => handleDelete(task._id)}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
