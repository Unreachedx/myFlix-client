import React, { useState } from 'react';

const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const data = { Username: username, Password: password };

    fetch('https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include' // Include credentials for CORS
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      localStorage.setItem('token', data.token); // Store token in local storage
      // Navigate to main view or perform other actions upon successful login
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      // Handle error or display error message
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginView;
