import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import { FiArrowLeft, FiClock, FiCalendar, FiDisc, FiUser, FiPlayCircle, FiAlertCircle } from 'react-icons/fi';
import SongCard from '../components/SongCard';
import Loading from '../components/Loading';
import api from '../services/api';
import '../styles/details.css';

const SongDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/songs/${id}`);
        if (res.data && res.data.success) {
          setSong(res.data.data);
        } else {
          setError('Could not retrieve song details.');
        }
      } catch (err) {
        console.error('[SongDetails] Error fetching song:', err);
        setError(err.response?.data?.message || 'Song not found in our catalog.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSong();
    }
  }, [id]);

  if (loading) {
    return <Loading message="Loading song information..." fullScreen />;
  }

  if (error || !song) {
    return (
      <div className="details-page">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FiArrowLeft /> Go Back
        </button>
        <div className="banner banner-danger" style={{ marginTop: '40px' }}>
          <FiAlertCircle />
          <span>{error || 'Song could not be located.'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FiArrowLeft /> Back to Results
      </button>

      {/* Hero Section */}
      <motion.div
        className="details-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="details-artwork-wrapper">
          {song.image ? (
            <img
              src={song.image}
              alt={song.title}
              className="details-artwork"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="details-artwork-fallback"
            style={{ display: song.image ? 'none' : 'flex' }}
          >
            <IoMusicalNotes />
          </div>
        </div>

        <div className="details-info">
          <span className="details-type-tag">Song Identification</span>
          <h1 className="details-title">{song.title}</h1>

          {song.artistId ? (
            <Link to={`/artist/${song.artistId}`} className="details-artist-link">
              <FiUser /> {song.artist}
            </Link>
          ) : (
            <span className="details-artist-link">
              <FiUser /> {song.artist}
            </span>
          )}

          {/* Metadata Badges */}
          <div className="details-meta-grid">
            <div className="meta-item">
              <FiDisc style={{ color: 'var(--accent-purple)' }} />
              <span>Album: <strong>{song.album || 'Single'}</strong></span>
            </div>
            <div className="meta-item">
              <FiCalendar style={{ color: 'var(--accent-blue)' }} />
              <span>Released: <strong>{song.releaseDate || 'Unknown'}</strong></span>
            </div>
            <div className="meta-item">
              <FiClock style={{ color: 'var(--accent-purple)' }} />
              <span>Duration: <strong>{song.duration || '3:30'}</strong></span>
            </div>
          </div>

          {/* Audio Preview Widget (if 30s preview is available) */}
          {song.previewUrl && (
            <div className="audio-preview-container">
              <span className="preview-label">
                <FiPlayCircle /> 30-Second Audio Preview
              </span>
              <audio
                controls
                src={song.previewUrl}
                className="details-audio-player"
              />
            </div>
          )}

          {/* External Streaming Actions */}
          <div className="details-actions">
            {song.spotifyUrl && (
              <a
                href={song.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-spotify"
              >
                <FaSpotify style={{ fontSize: '1.2rem' }} /> Open in Spotify
              </a>
            )}
            {song.youtubeUrl && (
              <a
                href={song.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-youtube"
              >
                <FaYoutube style={{ fontSize: '1.2rem' }} /> Watch on YouTube
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Related Songs Section */}
      {song.relatedSongs && song.relatedSongs.length > 0 && (
        <div className="related-section">
          <h3 className="related-title">More by {song.artist}</h3>
          <div className="results-grid">
            {song.relatedSongs.map((relSong, idx) => (
              <SongCard key={relSong._id || relSong.externalId || idx} song={relSong} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetails;
