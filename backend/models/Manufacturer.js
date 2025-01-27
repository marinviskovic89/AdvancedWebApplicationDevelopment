const mongoose = require('mongoose');

// Definisanje sheme za Proizvođača
const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  yearEstablished: { type: Number, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

// Middleware za sprečavanje brisanja proizvođača koji ima povezane proizvode
manufacturerSchema.pre('remove', async function(next) {
  const Product = mongoose.model('Product');
  const products = await Product.find({ manufacturer: this._id });

  if (products.length > 0) {
    return next(new Error('Cannot delete manufacturer, there are products associated with it.'));
  }

  next();
});

// Kreiranje modela za Proizvođača
const Manufacturer = mongoose.model('Manufacturer', manufacturerSchema);

module.exports = Manufacturer;
