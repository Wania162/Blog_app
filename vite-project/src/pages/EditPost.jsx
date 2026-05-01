import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

export default function EditPost() {
  const [form,    setForm]    = useState({ title: '', content: '', tags: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { id }   = useParams();
  const navigate = useNavigate();

  // Pehle post ka data load karo
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        const post = data.data;
        setForm({
          title:   post.title,
          content: post.content,
          tags:    post.tags?.join(', ') || '',
        });
      } catch {
        setError('The post did not load.');
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.put(`/posts/${id}`, form);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'The post was not updated.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✏️ Post edit </h1>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              style={styles.input}
              placeholder="Post of title..."
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Content *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={10}
              style={styles.textarea}
              placeholder="Post content..."
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Tags (comma separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              style={styles.input}
              placeholder="nodejs, backend, tutorial"
            />
          </div>
          <div style={styles.btns}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>
              {loading ? '⏳ Save...' : '💾 Save'}
            </button>
            <button type="button" onClick={() => navigate(`/post/${id}`)} style={styles.btnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container:    { maxWidth: '750px', margin: '2rem auto', padding: '0 1rem' },
  title:        { marginBottom: '1.5rem', color: '#1a1a2e' },
  error:        { background: '#f8d7da', color: '#842029', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '14px' },
  card:         { background: 'white', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  group:        { marginBottom: '1.25rem' },
  label:        { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#333' },
  input:        { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  textarea:     { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  btns:         { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  btnPrimary:   { padding: '10px 24px', background: '#e94560', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' },
  btnSecondary: { padding: '10px 24px', background: '#16213e', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' },
};