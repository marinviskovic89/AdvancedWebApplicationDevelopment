import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Pozivanje API-ja za dohvat korisnika
    axios
      .get('http://localhost:5000/api/users?role=user', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        setError('Failed to fetch users');
        console.error(err);
      });
  }, [navigate]);

  return (
    <div className="users-list-container">
      <h2>Users List</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  <h3>{user.username}</h3>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersList;
