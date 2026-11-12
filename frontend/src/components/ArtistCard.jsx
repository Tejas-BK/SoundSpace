import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiArrowRight } from 'react-icons/fi';

const ArtistCard = ({ artist }) => {
  if (!artist) return null;

  return (
    <motion.div
      className="artist-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="artist-avatar-wrapper">
        {artist.image ? (
          <img
            src={artist.image}
            alt={artist.name}
            className="artist-avatar"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="artist-avatar-fallback"
          style={{ display: artist.image ? 'none' : 'flex' }}
        >
          <FiUser />
        </div>
      </div>

      <div>
        <h4 className="artist-card-name">{artist.name}</h4>
        <p className="artist-card-genre">{artist.genre || 'Artist'}</p>
      </div>

      <Link to={`/artist/${artist.id}`} className="card-details-btn" style={{ marginTop: 'auto' }}>
        View Artist <FiArrowRight style={{ display: 'inline', marginLeft: '4px' }} />
      </Link>
    </motion.div>
  );
};

export default ArtistCard;
