const express = require('express');
const router = express.Router();
const Wedding = require('../models/Wedding');

// GET Afficher tous les mariages
router.get('/', async (req, res) => {
  const weddings = await Wedding.find();
  res.json(weddings);
});

// GET afficher un mariage par ID
router.get('/:id', async (req, res) => {
  const wedding = await Wedding.findById(req.params.id);
  res.json(wedding);
});

// POST Poster un nouveau mariage
router.post('/', async (req, res) => {
  const newWedding = new Wedding(req.body);
  const savedWedding = await newWedding.save();
  res.status(201).json(savedWedding);
});

// PUT Mettre à jour un mariage
router.put('/:id', async (req, res) => {
  const updatedWedding = await Wedding.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedWedding);
});

// DELETE Supprimer un mariage
router.delete('/:id', async (req, res) => {
  await Wedding.findByIdAndDelete(req.params.id);
  res.json({ message: 'Wedding deleted' });
});

module.exports = router;
