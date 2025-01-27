import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../UIcomponents/ManufacturerDetails.css'

const ManufacturerDetails = () => {
  const { manufacturerId } = useParams();
  const [manufacturer, setManufacturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="manufacturer-details">
      <h2>{manufacturer.name} Details</h2>
      <p className="manufacturer-country">
        <strong>Country:</strong> {manufacturer.country}
      </p>
      <p className="manufacturer-year">
        <strong>Year Established:</strong> {manufacturer.yearEstablished}
      </p>
      <p className="manufacturer-description">
        <strong>Description:</strong> {manufacturer.description}
      </p>
      <a href={`/manufacturers`}> Back to List </a>
    </div>
  );
};

export default ManufacturerDetails;
