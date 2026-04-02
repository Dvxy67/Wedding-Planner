const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const authMiddleware = require('./middleware/auth');

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch((err) => console.error('Erreur MongoDB :', err));

// Routes publiques (inscription / connexion)
app.use('/api/auth', require('./routes/authRoutes'));

// Routes protégées (nécessitent un token JWT valide)
app.use('/api/weddings', authMiddleware, require('./routes/weddingRoutes'));
app.use('/api/guests', authMiddleware, require('./routes/guestRoutes'));
app.use('/api/vendors', authMiddleware, require('./routes/vendorRoutes'));
app.use('/api/budgets', authMiddleware, require('./routes/budgetRoutes'));

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
