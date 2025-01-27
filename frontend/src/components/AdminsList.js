import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Pozivanje API-ja za dohvat admina
    axios
      .get('http://localhost:5000/api/users?role=admin', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch admins');
        console.error(err);
      });
  }, [navigate]);

  return (
    <div className="admins-list-container">
      <h2>Admins List</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          {admins.length === 0 ? (
            <p>No admins found.</p>
          ) : (
            <ul>
              {admins.map((admin) => (
                <li key={admin._id}>
                  <h3>{admin.username}</h3>
                  <p>Email: {admin.email}</p>
                  <p>Role: {admin.role}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminsList;
