import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../UIcomponents/ProductDetails.css'

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const setError = useState(null);

  useEffect(() => {
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
        .get(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setProduct(response.data))
        .catch((err) => {
          setError('Failed to fetch products');
          console.error(err);
        });
  }, [id, token, navigate]);

  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <p className="product-price"><strong>Price:</strong> ${product.price}</p>
      <p className="product-percentage"><strong>Percentage:</strong> {product.percentage}%</p>
      <p className="product-color"><strong>Color:</strong> {product.color}</p>
      <p className="product-type"><strong>Type:</strong> {product.type}</p>
      <p className="product-manufacturer">
        <strong>Manufacturer:</strong> {product.manufacturer.name}
      </p>

      {product.image && (
        <div className="product-image">
          <img
            src={`${product.image}`} // Putanja do slike na serveru
            alt={product.name}
            className="product-img"
          />
        </div>  
      )}

      <a href={`/manufacturer-details/${product.manufacturer._id}`}>Manufacturer Details</a>
    </div>
  );
};

export default ProductDetails;
