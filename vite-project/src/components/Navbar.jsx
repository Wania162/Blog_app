import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={close}>
        ✍️ BlogApp
      </Link>

      {/* Hamburger — mobile */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="navbar-link" onClick={close}>
          Posts
        </Link>

        {user ? (
          <>
            <div className="navbar-divider" />

            <Link to="/create" className="navbar-link" onClick={close}>
              + New Post
            </Link>

            <Link to="/dashboard" className="navbar-link" onClick={close}>
              Dashboard
            </Link>

            <div className="navbar-divider" />

            {/* Avatar */}
            <Link to="/profile" className="navbar-avatar-link" onClick={close}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="navbar-avatar-img"
                />
              ) : (
                <div className="navbar-avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="navbar-name">{user.name}</span>
            </Link>

            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="navbar-divider" />
            <Link to="/login"    className="navbar-link"    onClick={close}>Login</Link>
            <Link to="/register" className="navbar-link-btn" onClick={close}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}