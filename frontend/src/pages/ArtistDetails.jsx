import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpotify } from 'react-icons/fa';
import { FiArrowLeft, FiUser, FiMusic, FiAlertCircle } from 'react-icons/fi';
import SongCard from '../components/SongCard';
import Loading from '../components/Loading';
import api from '../services/api';
import '../styles/details.css';

const ArtistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/songs/artist/${id}`);
        if (res.data && res.data.success) {
          setArtist(res.data.data);
        } else {
          setError('Artist details not available.');
        }
      } catch (err) {
        console.error('[ArtistDetails] Error fetching artist:', err);
        setError(err.response?.data?.message || 'Artist profile could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtist();
    }
  }, [id]);

  if (loading) {
    return <Loading message="Loading artist discography..." fullScreen />;
  }

  if (error || !artist) {
    return (
      <div className="details-page">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft /> Go Back
        </button>
        <div className="banner banner-danger" style={{ marginTop: '40px' }}>
          <FiAlertCircle />
          <span>{error || 'Artist profile not found.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FiArrowLeft /> Back
      </button>

      {/* Artist Hero */}
      <motion.div
        className="details-hero artist-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="details-artwork-wrapper artist-hero-avatar">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="details-artwork"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="details-artwork-fallback"
            style={{ display: artist.image ? 'none' : 'flex' }}
          >
            <FiUser />
          </div>
        </div>

        <div className="details-info">
          <span className="details-type-tag">{artist.genre || 'Music Artist'}</span>
          <h1 className="details-title">{artist.name}</h1>

          <p className="artist-bio-box">
            {artist.biography}
          </p>

          <div className="details-actions">
            {artist.spotifyUrl && (
              <a
                href={artist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-spotify"
              >
                <FaSpotify style={{ fontSize: '1.2rem' }} /> Explore on Spotify
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Popular Songs Section */}
      {artist.popularSongs && artist.popularSongs.length > 0 && (
        <div className="related-section">
          <h3 className="related-title">
            <FiMusic style={{ color: 'var(--accent-purple)', display: 'inline', marginRight: '8px' }} />
            Popular Releases
          </h3>
          <div className="results-grid">
            {artist.popularSongs.map((song, idx) => (
              <SongCard key={song._id || song.externalId || idx} song={song} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDetails;
