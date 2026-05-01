import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post }) {
  return (
    <div className="pc-card">

      {/* Cover Image */}
      {post.image && (
        <img src={post.image} alt={post.title} className="pc-cover" />
      )}

      <div className="pc-body">

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="pc-tags">
            {post.tags.map(tag => (
              <span key={tag} className="pc-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="pc-title">
          <Link to={`/post/${post._id}`} className="pc-title-link">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="pc-excerpt">{post.excerpt}</p>

        <div className="pc-divider" />

        {/* Meta */}
        <div className="pc-meta">
          {/* Author */}
          <div className="pc-author">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="pc-author-avatar"
              />
            ) : (
              <div className="pc-author-placeholder">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="pc-author-name">{post.author?.name}</span>
          </div>

          {/* Views + Date */}
          <div className="pc-meta-right">
            <span className="pc-meta-item">
              👁️ {post.views}
            </span>
            <span className="pc-meta-item">
              📅 {new Date(post.createdAt).toLocaleDateString('en-PK')}
            </span>
          </div>
        </div>

        {/* Read More */}
        <div className="pc-footer">
          <Link to={`/post/${post._id}`} className="pc-read-more">
            Read More →
          </Link>
        </div>

      </div>
    </div>
  );
}