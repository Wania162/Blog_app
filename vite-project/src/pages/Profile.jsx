import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [avatar,  setAvatar]  = useState(user?.avatar || '');
  const [name,    setName]    = useState(user?.name   || '');
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const fileRef = useRef();

  // Auto clear messages
  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatar || typeof avatar === 'string') {
      return showError('Please select a photo first');
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      const { data } = await API.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreview(data.avatar);
      await refreshUser();
      showSuccess('Profile picture updated successfully! ✅');
    } catch (err) {
      showError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!preview) return showError('first upload a photo');
    setLoading(true);
    try {
      await API.delete('/users/avatar');
      setPreview('');
      setAvatar('');
      await refreshUser();
      showSuccess('Profile picture deleted successfully! ✅');
    } catch (err) {
      showError(err.response?.data?.message || 'not deleted');
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/users/update', { name });
      await refreshUser();
      showSuccess('Name updated! ✅');
    } catch (err) {
      showError(err.response?.data?.message || 'not updated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👤 My Profile</h1>

      {success && <div style={styles.success}>{success}</div>}
      {error   && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Profile Picture</h2>
        <div style={styles.avatarSection}>
          <div style={styles.avatarWrapper}>
            {preview ? (
              <img src={preview} alt="avatar" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={styles.avatarActions}>
            <input
              type="file"
              ref={fileRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button onClick={() => fileRef.current.click()} style={styles.btnSecondary}>
              📷 Select Photo
            </button>
            <button onClick={handleAvatarUpload} disabled={loading} style={styles.btnPrimary}>
              {loading ? '⏳ Upload...' : '☁️ Upload '}
            </button>
            {preview && (
              <button onClick={handleAvatarDelete} disabled={loading} style={styles.btnDelete}>
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
        <p style={styles.hint}>JPG, PNG ya WebP — max 5MB</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Profile Update Karo</h2>
        <form onSubmit={handleNameUpdate}>
          <div style={styles.group}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={styles.input}
              placeholder="Your name"
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Email (cannot be changed)</label>
            <input
              type="email"
              value={user?.email}
              disabled
              style={{ ...styles.input, background: '#f5f5f5', color: '#999' }}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? '⏳ Save...' : '💾 Save'}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Account Info</h2>
        <table style={{ fontSize: '14px', width: '100%' }}>
          <tbody>
            <tr>
              <td style={styles.tdLabel}>Role:</td>
              <td><span style={styles.badge}>{user?.role}</span></td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>Joined:</td>
              <td>{new Date(user?.createdAt).toLocaleDateString('en-PK')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container:         { maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' },
  heading:           { color: '#1a1a2e', marginBottom: '1.5rem' },
  success:           { background: '#d1e7dd', color: '#0f5132', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' },
  error:             { background: '#f8d7da', color: '#842029', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' },
  card:              { background: 'white', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  cardTitle:         { fontSize: '1rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '1.25rem' },
  avatarSection:     { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem' },
  avatarWrapper:     { flexShrink: 0 },
  avatarImg:         { width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e94560' },
  avatarPlaceholder: { width: '90px', height: '90px', borderRadius: '50%', background: '#e94560', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' },
  avatarActions:     { display: 'flex', flexDirection: 'column', gap: '8px' },
  hint:              { fontSize: '12px', color: '#aaa' },
  group:             { marginBottom: '1rem' },
  label:             { display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#333' },
  input:             { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  btnPrimary:        { background: '#e94560', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnSecondary:      { background: '#16213e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnDelete:         { background: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  tdLabel:           { color: '#888', paddingBottom: '8px', width: '100px' },
  badge:             { background: '#fff0f2', color: '#e94560', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', textTransform: 'capitalize' },
};