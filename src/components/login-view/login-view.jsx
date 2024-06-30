import { useState } from "react";
import axios from "axios";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login attempt", username, password);

    const data = {
      Username: username,
      Password: password,
    };

    try {
      const response = await axios.post(
        "https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important for cookies/auth tokens
        }
      );

      console.log("Response received", response);
      const result = response.data;
      if (result.user && result.token) {
        localStorage.setItem('token', result.token); // Store the token
        onLoggedIn(result.user, result.token);
      } else {
        alert("No such user");
      }
    } catch (e) {
      console.error("Error:", e);
      alert("Something went wrong: " + e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          minLength="3"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};
