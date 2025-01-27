import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddManufacturer = () => {
  const [name, setName] = useState('');
  const [yearEstablished, setYearEstablished] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
      // Provera tokena
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');  // Ako nema tokena, preusmeriti korisnika na login stranicu
            return;
          }
          
  },[navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newManufacturer = { name, yearEstablished, country, description };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .post('http://localhost:5000/api/manufacturers', newManufacturer, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        navigate('/manufacturers');
      })
      .catch((err) => {
        setError('Failed to add manufacturer');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Add Manufacturer</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Manufacturer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Year Established"
          value={yearEstablished}
          onChange={(e) => setYearEstablished(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Manufacturer</button>
      </form>
    </div>
  );
};

export default AddManufacturer;
