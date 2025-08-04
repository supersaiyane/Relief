// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(c => ({ ...c, [name]: value }));
  };

const handleSubmit = e => {
  e.preventDefault();
  const { username, password } = credentials;

  if (username.trim() && password.trim()) {
    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: username,
        password
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Invalid credentials');
      return res.json();
    })
    .then(({ sessionId, user }) => {
      // Persist session and login state
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRoleId', String(user.roleId));
      localStorage.setItem('userName', user.name);
      onLogin();
    })
    .catch(err => {
      alert(err.message || 'Login failed');
    });
  } else {
    alert('Please enter both username and password');
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
