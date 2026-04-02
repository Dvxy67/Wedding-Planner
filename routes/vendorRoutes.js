const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// GET Afficher tous les fournisseurs
router.get('/', async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});

// GET Afficher un fournisseur par son ID
router.get('/:id', async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  res.json(vendor);
});

// POST Poster un nouveau fournisseur
router.post('/', async (req, res) => {
  const newVendor = new Vendor(req.body);
  const savedVendor = await newVendor.save();
  res.status(201).json(savedVendor);
});

// PUT Mettre à jour un fournisseur
router.put('/:id', async (req, res) => {
  const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedVendor);
});

// DELETE Supprimer un fournisseur
router.delete('/:id', async (req, res) => {
  await Vendor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Vendor deleted' });
});

module.exports = router;
