const mongoose = require('mongoose');
const Manufacturer = require('../models/Manufacturer');
const Product = require('../models/Product');

// Uvoz dotenv za učitavanje .env fajla
require('dotenv').config();

// Povezivanje sa MongoDB bazom
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

async function createManufacturers() {
    const manufacturers = [
      {
        name: 'Pan Pivovara',
        yearEstablished: 2018,
        country: 'Croatia',
        description: 'Brewery known for their rich and smooth flavored beers.'
      }
      
];

for (const manufacturerData of manufacturers) {
    const manufacturer = new Manufacturer(manufacturerData);
    await manufacturer.save();
    console.log(`Manufacturer ${manufacturer.name} created`);
  }
}
      // Funkcija za unos proizvoda
async function createProducts() {
    const manufacturers = await Manufacturer.find(); // Dohvatanje svih proizvođača iz baze
  
    const products = [
      {
        name: 'Pan Lager',
        price: 21.00,
        percentage: 5.5,
        color: 'Golden Amber',
        type: 'Lager',
        manufacturer: manufacturers[0]._id, // Povezivanje sa proizvođačem Zlatna Dlan
        image: '../images/piva.jpg' // Putanja do slike
      }
    ];
  
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      console.log(`Product ${product.name} created with image: ${product.image}`);
    }
  }
async function seedData() {
  await createManufacturers();
  await createProducts();
  mongoose.connection.close();
}

// Pokrećemo funkciju za unos podataka
seedData().catch(err => {
  console.error('Error seeding data:', err);
  mongoose.connection.close();
});