import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ message = 'Loading SoundSpace...', fullScreen = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: fullScreen ? '0' : '60px 20px',
        minHeight: fullScreen ? 'calc(100vh - 80px)' : 'auto',
        width: '100%'
      }}
    >
      {/* Animated Equalizer Wave */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px' }}>
        {[0.1, 0.3, 0.5, 0.2, 0.4].map((delay, index) => (
          <motion.div
            key={index}
            animate={{
              height: ['10px', '38px', '14px'],
              backgroundColor: ['#8b5cf6', '#38bdf8', '#a855f7']
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: delay,
              ease: 'easeInOut'
            }}
            style={{
              width: '5px',
              borderRadius: '9999px',
              backgroundColor: '#8b5cf6'
            }}
          />
        ))}
      </div>

      <p
        style={{
          color: '#94a3b8',
          fontSize: '0.95rem',
          fontWeight: '500',
          letterSpacing: '0.2px'
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default Loading;
