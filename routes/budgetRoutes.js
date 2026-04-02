const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// GET Afficher tous les budgets
router.get('/', async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
});

// GET Afficher un budget par son ID
router.get('/:id', async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  res.json(budget);
});

// POST Poster un nouveau budget
router.post('/', async (req, res) => {
  const newBudget = new Budget(req.body);
  const savedBudget = await newBudget.save();
  res.status(201).json(savedBudget);
});

// PUT Mettre à jour un budget
router.put('/:id', async (req, res) => {
  const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBudget);
});

// DELETE Supprimer un budget
router.delete('/:id', async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.json({ message: 'Budget item deleted' });
});

module.exports = router;
