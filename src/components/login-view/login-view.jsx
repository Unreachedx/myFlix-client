import { useState } from "react";
import axios from "axios";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login attempt", username, password); // Log attempt

    const data = {
      Username: username,
      Password: password,
    };

/*     fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", // Include credentials if needed
    })
      .then((response) => {
        console.log("Response received", response); // Log response
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received", data); // Log received data
        if (data.user) {
          onLoggedIn(data.user, data.token);
        } else {
          alert("No such user");
        }
      })
      .catch((e) => {
        console.error("Error:", e);
        alert("Something went wrong: " + e.message);
      });
  }; */
  try {
    const result = await axios.post("http://localhost:8080/", data)
    console.log(result.data)
  } catch (error) {
    console.log(error, "login error")
  }}


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
