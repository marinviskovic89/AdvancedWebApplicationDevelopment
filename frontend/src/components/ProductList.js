import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import '../App.css'

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);  // Spremanje role u state
      fetchProducts(token);
    }
  }, [navigate]);

  // Dohvat proizvoda s backend-a
  const fetchProducts = (token) => {
    const urlParams = new URLSearchParams(location.search);
    const greaterThanPrice = urlParams.get('greaterThanPrice');  // Dohvati parametar iz URL-a

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let url = 'http://localhost:5000/api/products';
    console.log(greaterThanPrice)
    if (greaterThanPrice) {
      url += `?priceGreaterThan=${greaterThanPrice}`;  // Dodaj parametar u URL ako postoji
    }
    axios
      .get(url, config)
      .then((response) => {
        setUsername(response.data.username);
        setProducts(response.data.products);
      })
      .catch((err) => console.error('Failed to fetch products', err));
  };

  // Funkcija za brisanje proizvoda
  const deleteProduct = (productId) => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProducts(products.filter((product) => product._id !== productId));
      })
      .catch((err) => console.error('Failed to delete product', err));
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h2 className="header">Product List</h2>
      <h2 className="welcome-message">Welcome, {username}!</h2>
      {/* Add Product Button - only visible to admins */}
      {role === 'admin' && (
        <button className="add-button" onClick={() => navigate('/add-product')}>
          Add Product
        </button>
      )}

      {/* Manufacturers Button */}
      <button className="manufacturers-button" onClick={() => navigate('/manufacturers')}>
        Manufacturers
      </button>
  
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
  
      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">Price: {product.price}</p>
              <p className="product-type">Type: {product.type}</p>
              <p className="product-manufacturer">
                Manufacturer: {product.manufacturer.name}
              </p>
              <button
                className="details-button"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                Details
              </button>
  
              {/* Only show Edit and Delete buttons for admins */}
              {role === 'admin' && (
                <div className="admin-buttons">
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
