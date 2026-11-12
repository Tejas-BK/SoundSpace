import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoMusicalNotes } from 'react-icons/io5';
import { FiSearch, FiHome, FiGrid, FiLogOut, FiMenu, FiX, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <IoMusicalNotes className="brand-icon" />
          <span>Sound<span className="gradient-text">Space</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <FiHome /> Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <FiSearch /> Search
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <FiGrid /> Dashboard
            </NavLink>
          )}
        </div>

        {/* Desktop Auth Controls */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <div className="user-badge">
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                </div>
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Log Out">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FiHome /> Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FiSearch /> Search
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <FiGrid /> Dashboard
            </NavLink>
          )}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="user-badge" style={{ width: 'fit-content' }}>
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                </div>
                <span className="user-name">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                style={{ justifyContent: 'flex-start', padding: '0' }}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" className="btn-secondary" onClick={closeMenu} style={{ flex: 1 }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" onClick={closeMenu} style={{ flex: 1 }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
