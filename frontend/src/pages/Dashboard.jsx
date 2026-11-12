import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMusic, FiCompass } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import Recorder from '../components/Recorder';
import SongCard from '../components/SongCard';
import api from '../services/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [identifiedSong, setIdentifiedSong] = useState(null);
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Quick search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fetch initial featured tracks for discovery
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/songs/search?q=top%20hits');
        if (res.data && res.data.success) {
          setFeaturedSongs(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.warn('[Dashboard] Could not fetch featured songs:', err.message);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Dashboard Greeting Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Find Your Song <span className="gradient-text">🎵</span>
        </h1>
        <p className="dashboard-subtitle">
          Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name || 'Explorer'}</strong>! Don't know the song name? Record it and let SoundSpace identify it.
        </p>
      </div>

      {/* Quick Search Bar */}
      <div className="dashboard-search-section">
        <form onSubmit={handleSearchSubmit} className="search-form-wrapper">
          <FiSearch className="search-icon-inline" />
          <input
            type="text"
            className="search-input-inline"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary search-btn-inline">
            Search
          </button>
        </form>
      </div>

      {/* Main Microphone Audio Recorder Workstation */}
      <Recorder onSongIdentified={(song) => setIdentifiedSong(song)} />

      {/* Recognized Song Result Section (Shown dynamically when a song is recognized) */}
      {identifiedSong && (
        <div className="result-section">
          <h3 className="result-heading">
            <IoSparkles style={{ color: 'var(--accent-purple)' }} /> Successfully Identified Song
          </h3>
          <div style={{ maxWidth: '340px' }}>
            <SongCard song={identifiedSong} />
          </div>
        </div>
      )}

      {/* Trending / Quick Discovery Showcase */}
      <div className="result-section">
        <h3 className="result-heading">
          <FiCompass style={{ color: 'var(--accent-blue)' }} /> Trending Discoveries
        </h3>
        {loadingFeatured ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading music recommendations...</p>
        ) : featuredSongs.length > 0 ? (
          <div className="results-grid">
            {featuredSongs.map((song, idx) => (
              <SongCard key={song._id || song.externalId || idx} song={song} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No trending tracks found right now.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
