const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/Auth');
const productRoutes = require('./routes/Products')
const manufacturerRoutes = require('./routes/Manufacturers')
const userRoutes = require('./routes/Users')

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, 'frontend/public')));
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/manufacturers', manufacturerRoutes)
app.use('/api/users', userRoutes)
// Database connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
