import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar     from './components/Navbar';
import Home       from './pages/Home';
import Login      from './pages/Login';
import Register   from './pages/Register';
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';
import Dashboard  from './pages/Dashboard';
import EditPost   from './pages/EditPost';
import Profile    from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import './App.css';

// Sirf logged in users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>⏳ Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Sirf users — admin redirect to /admin
const UserOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>⏳ Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  return children;
};

// Sirf admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>⏳ Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/post/:id"  element={<SinglePost />} />

        {/* Sirf users */}
        <Route path="/create"    element={<UserOnlyRoute><CreatePost /></UserOnlyRoute>} />
        <Route path="/edit/:id"  element={<UserOnlyRoute><EditPost /></UserOnlyRoute>} />

        {/* Dono ke liye */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Sirf admin */}
        <Route path="/admin"     element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Segoe UI, sans-serif' }}>
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}