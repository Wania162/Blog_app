import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './CreatePost.css';

export default function CreatePost() {
  const [form,    setForm]    = useState({ title: '', content: '', tags: '' });
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileRef  = useRef();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async e => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    await API.post('/posts', {
      title:   form.title,
      content: form.content,
      tags:    form.tags,
    });
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Post not created');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="cp-wrapper">
      <div className="cp-container">

        {/* Header */}
        <div className="cp-header">
          <h1 className="cp-title">✍️ Write a New Post</h1>
        </div>

        {/* Error */}
        {error && <div className="cp-error">⚠️ {error}</div>}

        {/* Card */}
        <div className="cp-card">
          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div className="cp-group">
              <label className="cp-label">
                Title <span className="cp-required">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={100}
                className="cp-input"
                placeholder="Enter an engaging title..."
              />
              <span className="cp-hint">{form.title.length}/100</span>
            </div>

            {/* Content */}
            <div className="cp-group">
              <label className="cp-label">
                Content <span className="cp-required">*</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={10}
                className="cp-textarea"
                placeholder="Write your post content here..."
              />
            </div>

            {/* Tags */}
            <div className="cp-group">
              <label className="cp-label">Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="cp-input"
                placeholder="nodejs, backend, tutorial"
              />
              <span className="cp-hint">Comma separated</span>

              {/* Tag Preview */}
              {form.tags && (
                <div className="cp-tags-preview">
                  {form.tags.split(',').map((tag, i) =>
                    tag.trim() && (
                      <span key={i} className="cp-tag">{tag.trim()}</span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="cp-btns">
              <button
                type="submit"
                disabled={loading}
                className="cp-btn-primary"
              >
                {loading ? (
                  <span className="cp-loading">
                    <span className="cp-spinner" /> Publishing...
                  </span>
                ) : '🚀 Publish it'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="cp-btn-secondary"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}