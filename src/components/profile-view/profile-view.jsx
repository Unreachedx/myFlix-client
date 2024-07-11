import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export const ProfileView = ({ movies }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    dob: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const users = await response.json();
        const loggedInUser = users.find(u => u.username === 'currentUsername'); // Replace 'currentUsername' with the actual username of the logged-in user
        setUser(loggedInUser);
        setFormData({
          username: loggedInUser.username,
          password: '',
          email: loggedInUser.email,
          dob: loggedInUser.dob
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleToggleFavorite = async (movieId) => {
    try {
      const updatedFavorites = user.FavoriteMovies.includes(movieId)
        ? user.FavoriteMovies.filter(id => id !== movieId)
        : [...user.FavoriteMovies, movieId];
      // Update user's favorite movies in the backend
      const response = await fetch(`/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ FavoriteMovies: updatedFavorites })
      });
      if (!response.ok) {
        throw new Error('Failed to update favorite movies');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      setError(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      alert('User information updated successfully!');
    } catch (error) {
      setError(error);
    }
  };

  const handleDeregister = async () => {
    try {
      const response = await fetch(`/users/${user._id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to deregister user');
      }
      alert('User deregistered successfully');
      history.push('/login'); // Redirect to login or home page after deregistration
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  const favoriteMovies = movies.filter(m => user.FavoriteMovies.includes(m._id));

  return (
    <div className="profile-view">
      <h1>Profile</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </div>
        <button type="submit">Update</button>
      </form>
      <button onClick={handleDeregister}>Deregister</button>
      <h2>Favorite Movies</h2>
      <div className="favorite-movies">
        {favoriteMovies.map(movie => (
          <MovieCard key={movie._id} movie={movie} onToggleFavorite={handleToggleFavorite} />
        ))}
      </div>
    </div>
  );
};