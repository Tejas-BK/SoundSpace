import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import { FiInfo } from 'react-icons/fi';

const SongCard = ({ song }) => {
  if (!song) return null;

  // Resolve ID for routing (MongoDB _id or externalId)
  const songId = song._id || song.externalId || song.id;

  return (
    <motion.div
      className="song-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -6 }}
    >
      <div className="song-artwork-wrapper">
        {song.image ? (
          <img
            src={song.image}
            alt={song.title}
            className="song-artwork"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="song-artwork-fallback"
          style={{ display: song.image ? 'none' : 'flex' }}
        >
          <IoMusicalNotes />
        </div>
      </div>

      <div className="song-card-content">
        <Link
          to={`/song/${songId}`}
          className="song-card-title"
          title={song.title}
        >
          {song.title}
        </Link>
        <span className="song-card-artist" title={song.artist}>
          {song.artist}
        </span>
        <span className="song-card-album" title={song.album}>
          {song.album}
        </span>
      </div>

      <div className="song-card-actions">
        <div className="song-card-links">
          {song.spotifyUrl && (
            <a
              href={song.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-icon-btn card-icon-spotify"
              title="Open in Spotify"
            >
              <FaSpotify />
            </a>
          )}
          {song.youtubeUrl && (
            <a
              href={song.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-icon-btn card-icon-youtube"
              title="Watch on YouTube"
            >
              <FaYoutube />
            </a>
          )}
        </div>

        <Link
          to={`/song/${songId}`}
          className="card-details-btn"
          title="View Details"
        >
          <FiInfo style={{ display: 'inline', marginRight: '4px' }} />
          Details
        </Link>
      </div>
    </motion.div>
  );
};

export default SongCard;
