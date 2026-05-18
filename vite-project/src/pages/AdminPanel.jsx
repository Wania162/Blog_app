import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function AdminPanel() {
  const [stats,      setStats]      = useState(null);
  const [users,      setUsers]      = useState([]);
  const [posts,      setPosts]      = useState([]);
  const [activeTab,  setActiveTab]  = useState('stats');
  const [loading,    setLoading]    = useState(true);
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, postsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/posts'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setPosts(postsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Role change nahi hua');
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'user') {
        await API.delete(`/admin/users/${deleteId}`);
        setUsers(users.filter(u => u._id !== deleteId));
      } else {
        await API.delete(`/admin/posts/${deleteId}`);
        setPosts(posts.filter(p => p._id !== deleteId));
      }
      setDeleteId(null);
      setDeleteType('');
    } catch (err) {
      alert(err.response?.data?.message || 'Not deleted');
      setDeleteId(null);
    }
  };

  if (loading) return (
    <div style={styles.wrapper}>
      <div style={styles.center}>⏳ Loading...</div>
    </div>
  );

  return (
    <div style={styles.wrapper}>

      {/* Delete Popup */}
      {deleteId && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '0.5rem' }}>
              {deleteType === 'user' ? 'User Delete?' : 'Post Delete?'}
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '1.5rem' }}>
              Yeh action undo nahi ho sakta!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={handleDelete}            style={styles.confirmBtn}>Haan, Delete</button>
              <button onClick={() => setDeleteId(null)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>👑 Admin Panel</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Welcome, {user?.name}!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statNum}>{stats?.totalUsers || 0}</div>
            <div style={styles.statLabel}>TOTAL USERS</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📝</div>
            <div style={styles.statNum}>{stats?.totalPosts || 0}</div>
            <div style={styles.statLabel}>TOTAL POSTS</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👁️</div>
            <div style={styles.statNum}>{stats?.totalViews || 0}</div>
            <div style={styles.statLabel}>TOTAL VIEWS</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('users')}
            style={{ ...styles.tab, ...(activeTab === 'users' ? styles.tabActive : {}) }}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            style={{ ...styles.tab, ...(activeTab === 'posts' ? styles.tabActive : {}) }}
          >
            📝 Posts ({posts.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>👥 All Users</h2>
            {users.map(u => (
              <div key={u._id} style={styles.row}>
                <div style={styles.rowLeft}>
                  {u.avatar ? (
                    <img src={u.avatar} alt="" style={styles.avatar} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={styles.rowName}>{u.name}</div>
                    <div style={styles.rowEmail}>{u.email}</div>
                  </div>
                </div>
                <div style={styles.rowRight}>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                    style={{
                      ...styles.roleSelect,
                      background: u.role === 'admin' ? '#fff0f2' : '#f0f7ff',
                      color:      u.role === 'admin' ? '#e94560' : '#0066cc',
                      border:     u.role === 'admin' ? '1px solid #ffd0d8' : '1px solid #cce0ff',
                    }}
                  >
                    <option value="user">👤 User</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                  {u._id !== user?.id && (
                    <button
                      onClick={() => { setDeleteId(u._id); setDeleteType('user'); }}
                      style={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📝 All Posts</h2>
            {posts.map(post => (
              <div key={post._id} style={styles.row}>
                <div style={styles.rowLeft}>
                  <div style={styles.postDot} />
                  <div>
                    <div style={styles.rowName}>{post.title}</div>
                    <div style={styles.rowEmail}>
                      ✍️ {post.author?.name} | 👁️ {post.views} views
                    </div>
                  </div>
                </div>
                <div style={styles.rowRight}>
                  <button
                    onClick={() => { setDeleteId(post._id); setDeleteType('post'); }}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  wrapper:           { minHeight: 'calc(100vh - 64px)', background: '#f8f9fa', padding: '2rem 1rem' },
  container:         { maxWidth: '900px', margin: '0 auto' },
  center:            { textAlign: 'center', padding: '4rem', color: '#aaa' },
  header:            { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' },
  heading:           { fontSize: '1.75rem', fontWeight: 700, color: '#1a1a2e', margin: 0 },
  statsGrid:         { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' },
  statCard:          { background: 'white', borderRadius: '16px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' },
  statIcon:          { fontSize: '1.5rem', marginBottom: '0.5rem' },
  statNum:           { fontSize: '2rem', fontWeight: 700, color: '#e94560' },
  statLabel:         { fontSize: '11px', color: '#aaa', letterSpacing: '0.5px', marginTop: '4px' },
  tabs:              { display: 'flex', gap: '0.5rem', marginBottom: '1rem' },
  tab:               { padding: '10px 20px', border: '1.5px solid #e8e8e8', borderRadius: '10px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#555' },
  tabActive:         { background: '#e94560', color: 'white', border: '1.5px solid #e94560' },
  card:              { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' },
  cardTitle:         { fontSize: '1rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem', marginTop: 0 },
  row:               { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f8f8f8', gap: '1rem', flexWrap: 'wrap' },
  rowLeft:           { display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 },
  rowRight:          { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  avatar:            { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0' },
  avatarPlaceholder: { width: '36px', height: '36px', borderRadius: '50%', background: '#e94560', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, flexShrink: 0 },
  rowName:           { fontSize: '14px', fontWeight: 500, color: '#1a1a2e' },
  rowEmail:          { fontSize: '12px', color: '#aaa', marginTop: '2px' },
  postDot:           { width: '8px', height: '8px', borderRadius: '50%', background: '#e94560', flexShrink: 0 },
  roleSelect:        { padding: '5px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', outline: 'none' },
  deleteBtn:         { background: '#fff0f2', color: '#e94560', border: '1px solid #ffd0d8', padding: '5px 12px', borderRadius: '7px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 },
  overlay:           { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  popup:             { background: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  confirmBtn:        { background: '#e94560', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 },
  cancelBtn:         { background: '#f5f5f5', color: '#555', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};