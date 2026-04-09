const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET — Lister toutes les tâches (avec le mariage associé)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('wedding', 'name date');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — Récupérer une tâche par ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('wedding', 'name date');
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — Créer une nouvelle tâche
router.post('/', async (req, res) => {
  try {
    const { title, description, status, wedding } = req.body;
    const task = new Task({ title, description, status, wedding });
    const savedTask = await task.save();
    await savedTask.populate('wedding', 'name date');
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT — Mettre à jour une tâche
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('wedding', 'name date');
    if (!updatedTask) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — Supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Tâche non trouvée' });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
