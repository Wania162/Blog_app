import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Register nahi hua');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-wrapper">
      <div className="reg-card">

        {/* Logo */}
        <div className="reg-logo">
          <div className="reg-logo-icon">✍️</div>
        </div>

        <h2 className="reg-title">Create Account</h2>
        <p className="reg-subtitle">Join us and start writing today</p>

        {/* Error */}
        {error && (
          <div className="reg-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="reg-group">
            <label className="reg-label">Full Name</label>
            <div className="reg-input-wrapper">
              <span className="reg-input-icon">👤</span>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="reg-input"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="reg-group">
            <label className="reg-label">Email</label>
            <div className="reg-input-wrapper">
              <span className="reg-input-icon">✉️</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="reg-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="reg-group">
            <label className="reg-label">Password</label>
            <div className="reg-input-wrapper">
              <span className="reg-input-icon">🔒</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="reg-input"
                placeholder="6+ characters"
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="reg-btn">
            {loading ? (
              <>
                <span className="reg-spinner" />
                Registering...
              </>
            ) : 'Create Account →'}
          </button>

        </form>

        <div className="reg-divider">
          <div className="reg-divider-line" />
          <span className="reg-divider-text">OR</span>
          <div className="reg-divider-line" />
        </div>

        <p className="reg-bottom">
          Already have an account?{' '}
          <Link to="/login" className="reg-link">Login here</Link>
        </p>

      </div>
    </div>
  );
}