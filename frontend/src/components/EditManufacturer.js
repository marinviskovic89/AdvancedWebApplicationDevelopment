import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditManufacturer = () => {
  const { manufacturerId } = useParams();  // Dohvat ID-ja proizvođača iz URL-a
  const navigate = useNavigate();

  const [manufacturer, setManufacturer] = useState({
    name: '',
    yearEstablished: '',
    country: '',
    description: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Dohvat podataka o proizvođaču prema ID-u
    axios
      .get(`http://localhost:5000/api/manufacturers/${manufacturerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setManufacturer(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch manufacturer details');
        setLoading(false);
        console.error(err);
      });
  }, [manufacturerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManufacturer((prev) => ({
      ...prev,
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
    // Slanje ažuriranih podataka o proizvođaču
    axios
      .put(`http://localhost:5000/api/manufacturers/${manufacturerId}`, manufacturer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate('/manufacturers'); // Preusmeravanje na listu proizvođača nakon uspešnog uređivanja
      })
      .catch((err) => {
        setError('Failed to update manufacturer');
        console.error(err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Edit Manufacturer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={manufacturer.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Year Established</label>
          <input
            type="number"
            name="yearEstablished"
            value={manufacturer.yearEstablished}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={manufacturer.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={manufacturer.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditManufacturer;
