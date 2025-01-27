const express = require('express');
const Manufacturer = require('../models/Manufacturer');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/Auth');
const router = express.Router();

// Dohvati sve proizvođače
router.get('/', authenticate, async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find();
    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manufacturers', error });
  }
});
  router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
      const manufacturer = await Manufacturer.findById(id);
      if (!manufacturer) {
        return res.status(404).json({ error: 'Manufacturer not found' });
      }
      res.status(200).json(manufacturer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // POST - Dodaj novog proizvođača (Samo za admin korisnike)
  router.post('/', authenticate, isAdmin, async (req, res) => {
    const { name, yearEstablished, country, description } = req.body;
    try {
      const newManufacturer = new Manufacturer({
        name,
        yearEstablished,
        country,
        description
      });
  
      const savedManufacturer = await newManufacturer.save();
      res.status(201).json(savedManufacturer);  // Vraćamo kreiranog proizvođača
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // PUT - Ažuriraj proizvođača prema ID-u (Samo za admin korisnike)
  router.put('/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, yearEstablished, country, description } = req.body;
    try {
      const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
        id,
        { name, yearEstablished, country, description },
        { new: true }  // Vraća ažurirani dokument
      );
  
      if (!updatedManufacturer) {
        return res.status(404).json({ error: 'Manufacturer not found' });
      }
      res.status(200).json(updatedManufacturer);  // Vraćamo ažuriranog proizvođača
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // DELETE - Obrisi proizvođača prema ID-u (Samo za admin korisnike)
  router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const productCount = await Product.countDocuments({ manufacturer: id });
      if (productCount > 0) {
        return res.status(200).json({ error: 'Ne možete obrisati proizvođača jer postoje povezani proizvodi.' });
      }
      const deletedManufacturer = await Manufacturer.findByIdAndDelete(id);
      if (!deletedManufacturer) {
        return res.status(404).json({ error: 'Manufacturer not found' });
      }
      res.status(200).json({ message: 'Manufacturer deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;