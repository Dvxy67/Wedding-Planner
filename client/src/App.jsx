import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import WeddingsPage from './pages/WeddingsPage'
import GuestsPage from './pages/GuestsPage'
import VendorsPage from './pages/VendorsPage'
import BudgetPage from './pages/BudgetPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

// Composant qui protège une route : redirige vers /login si non connecté
function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function AppContent() {
  const { user, logout } = useAuth()

  return (
    <>
      <nav>
        {user ? (
          <>
            <NavLink to="/" end>Mariages</NavLink>
            <NavLink to="/guests">Invités</NavLink>
            <NavLink to="/vendors">Prestataires</NavLink>
            <NavLink to="/budget">Budget</NavLink>
            <span className="nav-user">Bonjour, {user.name}</span>
            <button onClick={logout} className="nav-logout">Déconnexion</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </nav>

      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes protégées */}
        <Route path="/" element={<PrivateRoute><WeddingsPage /></PrivateRoute>} />
        <Route path="/guests" element={<PrivateRoute><GuestsPage /></PrivateRoute>} />
        <Route path="/vendors" element={<PrivateRoute><VendorsPage /></PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute><BudgetPage /></PrivateRoute>} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
