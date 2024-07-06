import React, { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      Username: username,
      Password: password
    };

    fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
     })
      .then(response => response.json())
      .then(data => {
        console.log('Login successful:', data);
        const { user, token } = data;
        onLoggedIn(user, token); // Ensure this call remains to set user token
      })
      .catch(error => {
        console.error('Fetch operation failed:', error);
        setError(error.message); // Update state with error message
      });
    };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
      {error && <div>Error: {error}</div>}
    </form>
  );
};