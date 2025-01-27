import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../UIcomponents/ManufacturerList.css'
const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Provera tokena
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
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

      // Spremanje role korisnika (admin ili običan korisnik)
      setRole(decodedToken.role);
    } catch (error) {
      console.error('Invalid token', error);
      navigate('/login');
      return;
    }

    // Dohvat svih proizvođača
    axios
      .get('http://localhost:5000/api/manufacturers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setManufacturers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch manufacturers');
        setLoading(false);
        console.error(err);
      });
  }, [navigate]);

  const handleDelete = (manufacturerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  
    axios
      .delete(`http://localhost:5000/api/manufacturers/${manufacturerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.message === 'Manufacturer deleted successfully') {
          setManufacturers(
            manufacturers.filter((manufacturer) => manufacturer._id !== manufacturerId)
          );
          showAlertMessage('Manufacturer deleted successfully', 'success');
        } else {
          showAlertMessage('Ne možete obrisati proizvođača jer postoje povezani proizvodi', 'error');
        }
      })
      .catch((err) => {
        showAlertMessage('Error deleting manufacturer', 'error');
      });

  };
  
  const handleEdit = (manufacturerId) => {
    navigate(`/edit-manufacturer/${manufacturerId}`);
  };

  const handleDetails = (manufacturerId) => {
    navigate(`/manufacturer-details/${manufacturerId}`);
  };

  const handleAdd = () => {
    navigate('/add-manufacturer');
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    // Hide alert after 4 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="manufacturer-list-container">
      <div className="header-container">
        {/* Products Button */}
        <button className="products-button" onClick={() => navigate('/products')}>
          Products
        </button>
  
        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
  
      <h2 className="manufacturer-list-header">Manufacturer List</h2>
  
      {/* Add Manufacturer Button - only visible to admins */}
      {role === 'admin' && (
        <button className="add-manufacturer-button" onClick={handleAdd}>
          Add Manufacturer
        </button>
      )}
  
      {/* Alert for success or error */}
      {showAlert && (
        <div className={`alert ${alertType} show`}>
          {alertMessage}
        </div>
      )}
  
      {/* Manufacturer List */}
      <ul className="manufacturer-list">
        {manufacturers.map((manufacturer) => (
          <li key={manufacturer._id} className="manufacturer-item">
            <h3 className="manufacturer-name">{manufacturer.name}</h3>
            <p className="manufacturer-country">Country: {manufacturer.country}</p>
            <p className="manufacturer-year">Year Established: {manufacturer.yearEstablished}</p>
  
            <div className="manufacturer-actions">
              <button
                className="details-button"
                onClick={() => handleDetails(manufacturer._id)}
              >
                Details
              </button>
              {role === 'admin' && (
                <>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(manufacturer._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(manufacturer._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );  
  
};

export default ManufacturerList;
