import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Admin ko Admin Panel pe redirect karo
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await API.get('/posts/mine');
        setPosts(data.data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${deleteId}`);
      setPosts(posts.filter(p => p._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Not deleted');
      setDeleteId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="db-wrapper">
      <div className="db-container">

        {/* Delete Popup */}
        {deleteId && (
          <div className="db-overlay">
            <div className="db-popup">
              <div className="db-popup-icon">🗑️</div>
              <h3 className="db-popup-title">Delete Post?</h3>
              <p className="db-popup-text">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="db-popup-btns">
                <button onClick={handleDelete}            className="db-popup-confirm">Yes, Delete</button>
                <button onClick={() => setDeleteId(null)} className="db-popup-cancel">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="db-header">
          <h1 className="db-heading">
            Welcome, <span>{user?.name}</span>! 👋
          </h1>
          <div className="db-header-btns">
            {/* ✅ Sirf user ko New Post button dikhao */}
            {user?.role === 'user' && (
              <Link to="/create" className="db-btn-primary">+ New Post</Link>
            )}
            <button onClick={handleLogout} className="db-btn-logout">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="db-stats">
          <div className="db-stat-card">
            <div className="db-stat-icon">📝</div>
            <div className="db-stat-num">{posts.length}</div>
            <div className="db-stat-label">My Posts</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-icon">👁️</div>
            <div className="db-stat-num">
              {posts.reduce((s, p) => s + p.views, 0)}
            </div>
            <div className="db-stat-label">Total Views</div>
          </div>
          <div className="db-stat-card">
            <div className="db-stat-icon">⭐</div>
            <div className="db-stat-num small">{user?.role}</div>
            <div className="db-stat-label">Role</div>
          </div>
        </div>

        {/* Posts List */}
        <div className="db-card">
          <div className="db-card-header">
            <h2 className="db-card-title">📝 My Posts</h2>
            <span className="db-posts-count">{posts.length} posts</span>
          </div>

          {loading ? (
            <div className="db-loading">⏳ Loading your posts...</div>
          ) : posts.length === 0 ? (
            <div className="db-empty">
              No posts yet.{' '}
              {user?.role === 'user' && (
                <Link to="/create">Write your first post!</Link>
              )}
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="db-post-row">
                <div className="db-post-info">
                  <div className="db-post-dot" />
                  <Link to={`/post/${post._id}`} className="db-post-title">
                    {post.title}
                  </Link>
                  <span className="db-post-views">👁️ {post.views}</span>
                </div>
                {/* ✅ Sirf user ko edit/delete buttons dikhao */}
                {user?.role === 'user' && (
                  <div className="db-post-btns">
                    <button
                      onClick={() => navigate(`/edit/${post._id}`)}
                      className="db-edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(post._id)}
                      className="db-delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}