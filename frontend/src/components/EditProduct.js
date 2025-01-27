import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // Dodavanje biblioteke za dekodiranje tokena

const EditProduct = () => {
  const { productId } = useParams();  // Parametar iz URL-a koji je ID proizvoda
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    percentage: '',
    color: '',
    type: '',
    manufacturer: ''
  });
  const [manufacturers, setManufacturers] = useState([]);  // Držimo listu proizvođača
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Ako je token validan, učitati proizvod i proizvođače
    axios
      .get(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch product');
        setLoading(false);
        console.error(err);
      });
    
    axios
      .get('http://localhost:5000/api/manufacturers', {
        headers: { Authorization: `Bearer ${token}` },
      }) // Endpoint za dohvat proizvođača
      .then((response) => {
        setManufacturers(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch manufacturers');
        console.error(err);
      });
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .put(`http://localhost:5000/api/products/${productId}`, {
        name: product.name,
        price: product.price,
        percentage: product.percentage,
        color: product.color,
        type: product.type,
        manufacturerId: product.manufacturer,  // Ovdje šaljete manufacturer ID
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        navigate('/products');  // Preusmeravanje na početnu stranicu nakon uspešnog ažuriranja
      })
      .catch((err) => {
        setError('Failed to update product');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Percentage (Alcohol)</label>
          <input
            type="number"
            name="percentage"
            value={product.percentage}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Color</label>
          <input
            type="text"
            name="color"
            value={product.color}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={product.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Manufacturer</label>
          <select
            name="manufacturer"
            value={product.manufacturer}
            onChange={handleChange}
            required
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer._id} value={manufacturer._id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProduct;
