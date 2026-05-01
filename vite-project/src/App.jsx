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
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>⏳ Loading...</div>;
  return user ? children : <Navigate to="/login" />;
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
        <Route path="/create"    element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/edit/:id"  element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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