const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User')
const Manufacturer = require('../models/Manufacturer');
const { authenticate, isAdmin } = require('../middleware/Auth');
const router = express.Router();

// Prikaz svih proizvoda (dostupno svim korisnicima)
router.get('/', authenticate, async (req, res) => {
  try {
    const id = req.user.id;
    const {priceGreaterThan} = req.query;
    const query = {};
    if(priceGreaterThan) {
      query.price = {$gt: parseFloat(priceGreaterThan) };  //$gt veće od
    }
    // Dohvati korisnika
    const user = await User.findById(id);
    
    // Dohvati proizvode i popuni manufacturer
    const products = await Product.find(query).populate('manufacturer');
    // Poslati korisničko ime i proizvode u odgovoru
    res.status(200).json({
      username: user.username,
      products: products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params; // Iz URL-a uzimamo ID proizvoda
  try {
    const product = await Product.findById(id).populate('manufacturer'); // Povezivanje sa proizvođačem
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dodavanje novog proizvoda (samo za admina)
router.post('/', authenticate, isAdmin, async (req, res) => {
  const { name, price, percentage, color, type, manufacturerId } = req.body;
  try {
    const manufacturer = await Manufacturer.findById(manufacturerId);
    if (!manufacturer) {
      return res.status(400).json({ error: 'Manufacturer not found' });
    }

    const newProduct = new Product({
      name,
      price,
      percentage,
      color,
      type,
      manufacturer: manufacturerId
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editiranje proizvoda (samo za admina)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  const { name, price, percentage, color, type, manufacturerId } = req.body;
  try {
    const manufacturer = await Manufacturer.findById(manufacturerId);
    if (!manufacturer) {
      return res.status(400).json({ error: 'Manufacturer not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, percentage, color, type, manufacturer: manufacturerId },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Brisanje proizvoda (samo za admina)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
