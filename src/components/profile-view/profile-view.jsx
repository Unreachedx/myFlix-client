import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from './../movie-card/movie-card';

export const ProfileView = ({ username, token, movies, setUser }) => {
  const [user, setLocalUser] = useState(null);
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
        setLocalUser(userData);
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
      const updatedFavorites = isFavorite
        ? user.FavoriteMovies.filter(id => id !== movieId)
        : [...user.FavoriteMovies, movieId];
      const updatedUser = { ...user, FavoriteMovies: updatedFavorites };
      setLocalUser(updatedUser);
      setUser(updatedUser); // Update global user state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Ensure localStorage is updated as well
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
        body: JSON.stringify({
          Username: formData.username,
          Password: formData.password,
          Email: formData.email,
          Birthday: formData.dob
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setLocalUser(updatedUser);
      setUser(updatedUser); // Update global user state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Ensure localStorage is updated as well
      navigate('/profile'); // Navigate to the profile view
    } catch (error) {
      setError(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://myflixapplication-paddy-fac687c8aed3.herokuapp.com/users/${username}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      localStorage.clear();
      setUser(null);
      navigate('/');
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

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Date of Birth:
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
      <button onClick={handleDelete}>Delete Profile</button>

      <h3>Favorite Movies</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {user.FavoriteMovies.length === 0 ? (
          <div>No favorite movies</div>
        ) : (
          user.FavoriteMovies.map((movieId) => {
            const movie = movies.find((m) => m.id === movieId);
            if (movie) {
              return (
                <div key={movie.id} style={{ margin: '10px' }}>
                  <MovieCard
                    movie={movie}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={user.FavoriteMovies.includes(movie.id)}
                  />
                </div>
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};
