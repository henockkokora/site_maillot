require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/site_maillot';

app.use(cors());
app.use(express.json());

// Chargement du secret et des identifiants admin
const ADMIN_USER = process.env.ADMIN_USER ;
const ADMIN_PASS = process.env.ADMIN_PASS ;
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

// Middleware d'authentification JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, ADMIN_JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

// Route de login admin
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ admin: true }, ADMIN_JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
});

// Connexion MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Modèle Commande
const commandeSchema = new mongoose.Schema({
  name: String,
  location: String,
  contact: String,
  cart: [
    {
      jersey: {
        name: String,
        price: Number
      },
      quantity: Number
    }
  ],
  date: String,
  livree: { type: Boolean, default: false }
});
const Commande = mongoose.model('Commande', commandeSchema);

// POST /commandes : Ajouter une commande (public)
app.post('/commandes', async (req, res) => {
  const { name, location, contact, cart, date } = req.body;
  if (!name || !location || !contact || !cart || !date) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  try {
    const commande = new Commande({ name, location, contact, cart, date });
    await commande.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /commandes : Récupérer toutes les commandes (protégé)
app.get('/commandes', authMiddleware, async (req, res) => {
  try {
    const commandes = await Commande.find().sort({ date: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /commandes/:id/livrer : Marquer une commande comme livrée
app.patch('/commandes/:id/livrer', authMiddleware, async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { livree: true },
      { new: true }
    );
    if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /commandes/:id/nonlivrer : Remettre une commande à non livrée
app.patch('/commandes/:id/nonlivrer', authMiddleware, async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { livree: false },
      { new: true }
    );
    if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /commandes/:id : Supprimer une commande
app.delete('/commandes/:id', authMiddleware, async (req, res) => {
  try {
    const commande = await Commande.findByIdAndDelete(req.params.id);
    if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Endpoint pour vérifier que le serveur tourne
app.get('/', (req, res) => {
  res.send('API commandes OK (MongoDB)');
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
