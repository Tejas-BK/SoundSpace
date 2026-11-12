import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import SongDetails from './pages/SongDetails';
import ArtistDetails from './pages/ArtistDetails';

// Styles
import './styles/App.css';
import { IoMusicalNotes } from 'react-icons/io5';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<Search />} />
              <Route path="/song/:id" element={<SongDetails />} />
              <Route path="/artist/:id" element={<ArtistDetails />} />

              {/* 404 Catch-All Route */}
              <Route
                path="*"
                element={
                  <div className="empty-state" style={{ minHeight: '60vh' }}>
                    <h2 className="empty-title" style={{ fontSize: '2rem' }}>404 - Page Not Found</h2>
                    <p className="empty-subtitle" style={{ marginBottom: '24px' }}>
                      The page you are looking for does not exist in SoundSpace.
                    </p>
                    <Link to="/" className="btn-primary">
                      Return to Home
                    </Link>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Global Footer */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-logo">
                <IoMusicalNotes style={{ color: 'var(--accent-purple)' }} />
                <span>Sound<span className="gradient-text">Space</span></span>
              </div>
              <p className="footer-desc">
                SoundSpace is a full-stack MERN music discovery and audio identification platform. Built with React, Express, Node.js, and MongoDB.
              </p>
              <div className="footer-bottom">
                &copy; {new Date().getFullYear()} SoundSpace. College BCA Major Project. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
