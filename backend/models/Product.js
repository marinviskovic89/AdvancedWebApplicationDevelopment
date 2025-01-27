const mongoose = require('mongoose');

// Definicija sheme za Proizvod (Pivo)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  percentage: { type: Number, required: false }, // Postotak alkohola
  color: { type: String, required: true },
  type: { type: String, required: true }, 
  image: { type: String, required: false },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true }, // Povezivanje sa proizvođačem
}, { timestamps: true });

// Kreiranje modela za Proizvod
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
