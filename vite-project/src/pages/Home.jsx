import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import './Home.css';

export default function Home() {
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/posts?page=${page}&limit=6`);
      setPosts(data.data);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch {
      setError('Posts load nahi hue.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="home-wrapper">
      <div className="home-loading">
        <div className="home-spinner" />
        <p>Loading posts...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="home-wrapper">
      <div className="home-error">❌ {error}</div>
    </div>
  );

  return (
    <div className="home-wrapper">
      <div className="home-container">

        {/* Header */}
        <div className="home-header">
          <h1 className="home-heading">
            All <span>Posts</span>
          </h1>
          {total > 0 && (
            <span className="home-post-count">
              {total} posts
            </span>
          )}
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="home-empty">
            <div className="home-empty-icon">📭</div>
            <h3>No posts yet</h3>
            <p>Be the first one to write something!</p>
            <Link to="/create" className="home-empty-btn">
              + Write First Post
            </Link>
          </div>
        ) : (
          <div className="home-posts">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="home-pagination">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="home-page-btn"
            >
              ← Prev
            </button>

            <div className="home-page-info">
              <span className="home-page-current">{page}</span>
              <span>/</span>
              <span>{totalPages}</span>
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="home-page-btn"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}