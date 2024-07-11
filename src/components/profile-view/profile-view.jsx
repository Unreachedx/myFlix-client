import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export const ProfileView = ({ username, token, movies }) => {
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
        const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        setUser(userData);
        setFormData({
          username: userData.Username,
          password: '',
          email: userData.Email,
          dob: userData.Birthday
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, token]);

  const handleToggleFavorite = async (movieId) => {
    try {
      const isFavorite = user.FavoriteMovies.includes(movieId);
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}/favorites/${movieId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to update favorite movies');
      }
      // Update local user state
      const updatedFavorites = isFavorite
        ? user.FavoriteMovies.filter(id => id !== movieId)
        : [...user.FavoriteMovies, movieId];
      setUser({ ...user, FavoriteMovies: updatedFavorites });
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
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
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
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to deregister user');
      }
      alert('User deregistered successfully');
      navigate('/login'); // Redirect to login or home page after deregistration
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
