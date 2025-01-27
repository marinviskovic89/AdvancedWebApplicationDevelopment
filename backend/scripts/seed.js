// Uvoz mongoose i modela
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

// Funkcija za unos proizvođača
async function createManufacturers() {
  const manufacturers = [
    {
      name: 'Zlatna Dlan',
      yearEstablished: 2018,
      country: 'Croatia',
      description: 'Brewery known for their rich and smooth flavored beers.'
    },
    {
      name: 'Kvarner Pivo',
      yearEstablished: 2010,
      country: 'Croatia',
      description: 'Craft brewery that draws inspiration from the Kvarner region.'
    },
    {
      name: 'Vojvodina Brewing Co.',
      yearEstablished: 2017,
      country: 'Serbia',
      description: 'Serbian brewery focused on experimental and craft beers.'
    },
    {
      name: 'Carigradska Pivovara',
      yearEstablished: 2005,
      country: 'Serbia',
      description: 'Serbian brewery offering a variety of high-quality lagers.'
    },
    {
      name: 'Lipa Brewing',
      yearEstablished: 2019,
      country: 'Croatia',
      description: 'Craft brewery specializing in organic and sustainable brewing practices.'
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
      name: 'Zlatna Dlan Pale Ale',
      price: 21.00,
      percentage: 5.5,
      color: 'Golden Amber',
      type: 'Pale Ale',
      manufacturer: manufacturers[0]._id // Povezivanje sa proizvođačem Zlatna Dlan
    },
    {
      name: 'Kvarner Pivo Wheat',
      price: 19.50,
      percentage: 4.8,
      color: 'Cloudy Yellow',
      type: 'Wheat Beer',
      manufacturer: manufacturers[1]._id // Povezivanje sa proizvođačem Kvarner Pivo
    },
    {
      name: 'Vojvodina Brewing Co. Lager',
      price: 18.00,
      percentage: 4.9,
      color: 'Light Yellow',
      type: 'Lager',
      manufacturer: manufacturers[2]._id // Povezivanje sa proizvođačem Vojvodina Brewing Co.
    },
    {
      name: 'Carigradska Pivovara Black',
      price: 23.00,
      percentage: 6.0,
      color: 'Black',
      type: 'Stout',
      manufacturer: manufacturers[3]._id // Povezivanje sa proizvođačem Carigradska Pivovara
    },
    {
      name: 'Lipa Brewing Organic IPA',
      price: 22.50,
      percentage: 6.2,
      color: 'Golden Amber',
      type: 'IPA',
      manufacturer: manufacturers[4]._id // Povezivanje sa proizvođačem Lipa Brewing
    }
  ];

  for (const productData of products) {
    const product = new Product(productData);
    await product.save();
    console.log(`Product ${product.name} created`);
  }
}

// Pokretanje funkcija za unos podataka
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
