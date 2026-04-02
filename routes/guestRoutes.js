const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');

// GET Afficher tous les invités
router.get('/', async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
});

// GET Afficher un invité par son ID
router.get('/:id', async (req, res) => {
  const guest = await Guest.findById(req.params.id);
  res.json(guest);
});

// POST Poster un nouvel invité
router.post('/', async (req, res) => {
  const newGuest = new Guest(req.body);
  const savedGuest = await newGuest.save();
  res.status(201).json(savedGuest);
});

// PUT Mettre à jour un invité
router.put('/:id', async (req, res) => {
  const updatedGuest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedGuest);
});

// DELETE Supprimer un invité
router.delete('/:id', async (req, res) => {
  await Guest.findByIdAndDelete(req.params.id);
  res.json({ message: 'Guest deleted' });
});

module.exports = router;
