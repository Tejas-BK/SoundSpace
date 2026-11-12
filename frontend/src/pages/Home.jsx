import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { IoMusicalNotes, IoSparkles } from 'react-icons/io5';
import { FiMic, FiCpu, FiCompass, FiHeadphones, FiArrowRight } from 'react-icons/fi';
import '../styles/home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      num: '01',
      icon: <FiMic />,
      title: '1. Record',
      desc: 'Capture a quick 5 to 15 second audio sample directly from your browser using your microphone.'
    },
    {
      num: '02',
      icon: <FiCpu />,
      title: '2. Identify',
      desc: 'SoundSpace processes the recording and matches acoustic patterns with our recognition service.'
    },
    {
      num: '03',
      icon: <FiCompass />,
      title: '3. Discover',
      desc: 'Uncover full song titles, artist biographies, album artwork, release dates, and related music.'
    },
    {
      num: '04',
      icon: <FiHeadphones />,
      title: '4. Listen',
      desc: 'Listen to 30-second audio previews or jump straight to full songs on Spotify and YouTube.'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge">
            <IoSparkles /> Intelligent Music Recognition
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="hero-title">
              Discover Any Song
            </h1>
            <h2 className="hero-subtitle gradient-text">
              Just Record It.
            </h2>
          </div>

          <p className="hero-desc">
            Don't know the name of a song? Simply record a few seconds and SoundSpace helps you discover the song, artist, album, and related music in seconds.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                Go to Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                  Get Started <FiArrowRight />
                </Link>
                <Link to="/login" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  Login
                </Link>
              </>
            )}
            <Link to="/search" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
              Search Catalog
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="features-section">
        <div className="section-header">
          <h3 className="section-title">How SoundSpace Works</h3>
          <p className="section-subtitle">
            Four simple steps to find, identify, and stream any track you hear in the wild.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <span className="feature-number">{feat.num}</span>
              <div className="feature-icon-box">
                {feat.icon}
              </div>
              <h4 className="feature-title">{feat.title}</h4>
              <p className="feature-desc">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <IoMusicalNotes style={{ fontSize: '3rem', color: 'var(--accent-purple)' }} />
          <h3 className="cta-title">Ready to Find Your Favorite Song?</h3>
          <p className="cta-desc">
            Join SoundSpace today or explore our live music catalog with instant high-quality previews.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn-primary">
              {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'} <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
