import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../UIcomponents/AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    percentage: '',
    color: '',
    type: '',
    manufacturer: ''
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Provera tokena
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');  // Ako nema tokena, preusmeriti korisnika na login stranicu
          return;
        }
    
        try {
          // Dekodiranje tokena
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;  // Trenutno vreme u sekundama
    
          // Ako je token istekao, preusmeriti na login
          if (decodedToken.exp < currentTime) {
            navigate('/login');
            return;
          }
        } catch (error) {
          console.error('Invalid token', error);
          navigate('/login');  // Ako token nije validan, preusmeriti na login
          return;
        }
    axios
      .get('http://localhost:5000/api/manufacturers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setManufacturers(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch manufacturers');
        console.error(err);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Pošaljite POST zahtev za dodavanje proizvoda
    axios
      .post('http://localhost:5000/api/products',  {
        name: product.name,
        price: product.price,
        percentage: product.percentage,
        color: product.color,
        type: product.type,
        manufacturerId: product.manufacturer,  // Ovdje šaljete manufacturer ID
      }, {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        navigate('/products');  // Preusmeravanje na početnu stranicu nakon uspešnog dodavanja
      })
      .catch((err) => {
        setError('Failed to add product');
        console.error('Error adding product:', err.response.data);
      });
  };

  return (
    <div className="add-product-container">
    <h2 className="header">Add Product</h2>
    {error && <p className="error">{error}</p>} {/* Prikazivanje greške ako postoji */}

    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Percentage (Alcohol)</label>
        <input
          type="number"
          name="percentage"
          value={product.percentage}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Color</label>
        <input
          type="text"
          name="color"
          value={product.color}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Type</label>
        <input
          type="text"
          name="type"
          value={product.type}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Manufacturer</label>
        <select
          name="manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="">Select Manufacturer</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer._id} value={manufacturer._id}>
              {manufacturer.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="submit-button">Add Product</button>
    </form>
  </div>
  );
};

export default AddProduct;
