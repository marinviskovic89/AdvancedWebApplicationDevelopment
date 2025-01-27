import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserCount = () => {
  const [count, setCount] = useState({ countAdmins: 0, countUsers: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pozivanje API-ja za dohvat broja admina i korisnika
    axios
      .get('http://localhost:5000/api/users/count/members')
      .then((response) => {
        setCount({
          countAdmins: response.data.countAdmins,
          countUsers: response.data.countUsers,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch counts');
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="user-count-container">
      <h2 className="user-count-title">User and Admin Count</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="count-stats">
          <div className="count-item">
            <h3>Admins</h3>
            <Link to="/admins">
              <p>{count.countAdmins}</p>
            </Link>
          </div>
          <div className="count-item">
            <h3>Users</h3>
            <Link to="/user">
              <p>{count.countUsers}</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCount;
