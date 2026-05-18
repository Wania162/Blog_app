import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

// ✅ styles return se pehle
const styles = {
  roleOption: {
    display:        'flex',
    alignItems:     'center',
    padding:        '10px 20px',
    border:         '1.5px solid #e8e8e8',
    borderRadius:   '10px',
    cursor:         'pointer',
    fontSize:       '14px',
    fontWeight:     500,
    color:          '#333',
    flex:           1,
    justifyContent: 'center',
    transition:     'all 0.2s',
  },
};

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'user' });
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
      await register(form.name, form.email, form.password, form.role);
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

        <div className="reg-logo">
          <div className="reg-logo-icon">✍️</div>
        </div>

        <h2 className="reg-title">Create Account</h2>
        <p className="reg-subtitle">Join us and start writing today</p>

        {error && (
          <div className="reg-error">⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit}>

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

          {/* Role Selection */}
          <div className="reg-group">
            <label className="reg-label">Account Type</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
              <label style={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === 'user'}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ marginRight: '6px' }}
                />
                👤 User
              </label>
              <label style={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === 'admin'}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ marginRight: '6px' }}
                />
                👑 Admin
              </label>
            </div>
          </div>

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