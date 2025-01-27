import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import '../UIcomponents/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [role, SetRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try{
        const decodedToken = jwtDecode(token);
        SetRole(decodedToken.role);
    } catch(error) {
        console.log('Inavlid token', error);
        navigate('/login');
        return;
    }

    axios
        .get("http://localhost:5000/api/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then((response) => {
            setUsers(response.data);
        })
        .catch ((err) => {
            setError("Failed to fetch users");
      });

  }, [navigate]);

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };
  const handlePassword = (userId) => {
    navigate(`/authent/${userId}`);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h1 className="user-list-title">Users List</h1>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {role === "admin" ? (
        users.length === 0 ? (
          <p className="user-list-empty">No users found.</p>
        ) : (
          <div className="user-list-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <h2 className="user-name">{user.username}</h2>
                <p className="user-detail">
                  <span className="user-label">Email:</span> {user.email}
                </p>
                <p className="user-detail">
                  <span className="user-label">Role:</span> {user.role}
                </p>
                <div className="user-actions">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="user-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handlePassword(user._id)}
                    className="user-button password-button"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="user-list-error">You do not have permission to view this data.</p>
        )}
    </div>
  );  
};

export default UserList;
