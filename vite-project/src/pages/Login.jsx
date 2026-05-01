import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Not logged in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} required style={styles.input}
              placeholder="Enter your email" />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} required style={styles.input}
              placeholder="Enter your password" />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? '⏳ Login...' : 'Login'}
          </button>
        </form>
        <p style={styles.bottom}>
          New user? <Link to="/register" style={styles.linkText}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper:  { display: 'flex', justifyContent: 'center', padding: '3rem 1rem' },
  card:     { background: 'white', borderRadius: '10px', padding: '2rem', width: '100%', maxWidth: '420px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)' },
  title:    { marginBottom: '1.5rem', color: '#1a1a2e' },
  error:    { background: '#f8d7da', color: '#842029', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' },
  group:    { marginBottom: '1rem' },
  label:    { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#333' },
  input:    { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btn:      { width: '100%', padding: '12px', background: '#e94560', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer', marginTop: '0.5rem' },
  bottom:   { textAlign: 'center', marginTop: '1rem', fontSize: '14px', color: '#666' },
  linkText: { color: '#e94560', textDecoration: 'none' },
};