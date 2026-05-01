import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SinglePost() {
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data.data);
      } catch {
        setError('The post did not load.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'The post did not delete.');
    }
  };

  if (loading) return <div style={styles.center}>⏳ Loading...</div>;
  if (error)   return <div style={styles.center}>❌ {error}</div>;
  if (!post)   return null;

  const isAuthor = user && post.author?._id === user.id;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.back}>← Back to</Link>
      <div style={styles.card}>
        <div style={styles.tags}>
          {post.tags?.map(tag => <span key={tag} style={styles.tag}>{tag}</span>)}
        </div>
        <h1 style={styles.title}>{post.title}</h1>
        <div style={styles.meta}>
          <span>✍️ {post.author?.name}</span>
          <span>👁️ {post.views} views</span>
          <span>📅 {new Date(post.createdAt).toLocaleDateString('en-PK')}</span>
        </div>
        <div style={styles.content}>
          {post.content.split('\n').map((line, i) => (
            <p key={i} style={{ marginBottom: '0.75rem' }}>{line}</p>
          ))}
        </div>

        {/* Edit + Delete — sirf apni post pe dikhega */}
        {isAuthor && (
          <div style={styles.actions}>
            <button
              onClick={() => navigate(`/edit/${post._id}`)}
              style={styles.editBtn}
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              style={styles.deleteBtn}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '750px', margin: '2rem auto', padding: '0 1rem' },
  back:      { color: '#e94560', textDecoration: 'none', fontSize: '14px' },
  card:      { background: 'white', borderRadius: '10px', padding: '2rem', marginTop: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  tags:      { marginBottom: '1rem' },
  tag:       { display: 'inline-block', background: '#fff0f2', color: '#e94560', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', marginRight: '4px' },
  title:     { fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '1rem', lineHeight: 1.3 },
  meta:      { display: 'flex', gap: '1.5rem', fontSize: '13px', color: '#999', marginBottom: '1.5rem', flexWrap: 'wrap' },
  content:   { fontSize: '15px', lineHeight: 1.8, color: '#333' },
  actions:   { marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', gap: '1rem' },
  editBtn:   { background: '#0066cc', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  deleteBtn: { background: '#dc3545', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  center:    { textAlign: 'center', padding: '4rem', color: '#666' },
};