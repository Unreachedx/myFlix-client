import React, { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // If you need to send cookies or other credentials
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          onLoggedIn(data.user, data.token);
        } else {
          throw new Error("Invalid response data");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error);
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
      {error && <div>Error: {error.message}</div>}
    </form>
  );
};