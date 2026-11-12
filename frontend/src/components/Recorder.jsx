import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMic,
  FiSquare,
  FiTrash2,
  FiRotateCcw,
  FiSearch,
  FiAlertCircle,
  FiCheckCircle,
  FiUploadCloud,
  FiFileText,
  FiInfo
} from 'react-icons/fi';
import api from '../services/api';
import Loading from './Loading';

const MAX_RECORDING_SECONDS = 15;

const Recorder = ({ onSongIdentified }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'info' | 'warning' | 'danger' | 'success', text: string }

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      stopTracks();
      clearInterval(timerIntervalRef.current);
    };
  }, [audioUrl]);

  // Stop active media stream tracks
  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Cross-browser helper to get audio stream
  const getAudioStream = async () => {
    // 1. Check standard navigator.mediaDevices
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    // 2. Check vendor-prefixed navigator.getUserMedia
    const legacyGetUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (legacyGetUserMedia) {
      return new Promise((resolve, reject) => {
        legacyGetUserMedia.call(navigator, { audio: true }, resolve, reject);
      });
    }

    return null;
  };

  // Start recording audio
  const startRecording = async () => {
    setStatusMessage(null);
    setAudioBlob(null);
    setIsUploaded(false);
    setAudioFileName('');

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioChunksRef.current = [];

    try {
      const stream = await getAudioStream();

      if (!stream) {
        const isSecure =
          window.isSecureContext ||
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        if (!isSecure) {
          setStatusMessage({
            type: 'warning',
            text: `Microphone is blocked by the browser on network IP (${window.location.hostname}). If on this computer, open http://localhost:5173 instead. If on mobile, please use the "Upload Audio File" button below.`
          });
        } else {
          setStatusMessage({
            type: 'warning',
            text: 'Microphone recording is not available. Please allow microphone permissions or use the "Upload Audio File" option below.'
          });
        }
        return;
      }

      streamRef.current = stream;

      // Determine supported mimeType
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(recordedBlob);
        setAudioFileName('recorded-sample.webm');
        const url = URL.createObjectURL(recordedBlob);
        setAudioUrl(url);
        stopTracks();
      };

      mediaRecorder.start(250); // Slice data chunks every 250ms
      setIsRecording(true);
      setTimerSeconds(0);

      // Start 15-second timer
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= MAX_RECORDING_SECONDS - 1) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('[Recorder] Microphone error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setStatusMessage({
          type: 'warning',
          text: 'Microphone permission was denied. Please allow microphone access in your browser address bar, or use the "Upload Audio File" option below.'
        });
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setStatusMessage({
          type: 'danger',
          text: 'No microphone was detected on this device. You can identify songs by uploading an audio file below.'
        });
      } else {
        setStatusMessage({
          type: 'warning',
          text: `Microphone unavailable (${err.message}). You can use the "Upload Audio File" button below to identify any song.`
        });
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerIntervalRef.current);
    setIsRecording(false);
  };

  // Handle manual file upload (MP3, WAV, WebM, M4A, OGG)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be picked again if desired
    e.target.value = '';

    // File size validation (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setStatusMessage({
        type: 'danger',
        text: 'Selected audio file exceeds the 15MB limit. Please select a shorter audio clip.'
      });
      return;
    }

    deleteRecording();
    setAudioBlob(file);
    setAudioFileName(file.name);
    setIsUploaded(true);
    setAudioUrl(URL.createObjectURL(file));
    setStatusMessage({
      type: 'info',
      text: `Audio file loaded: "${file.name}". Click "Identify Song" to process.`
    });
  };

  // Delete recorded or uploaded clip
  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioFileName('');
    setIsUploaded(false);
    setTimerSeconds(0);
    setStatusMessage(null);
  };

  // Upload and identify song
  const identifySong = async () => {
    if (!audioBlob) return;

    setIsIdentifying(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      const filename = audioFileName || 'sample.webm';
      formData.append('audio', audioBlob, filename);

      const response = await api.post('/songs/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const resData = response.data;

      if (resData.configured === false) {
        setStatusMessage({
          type: 'info',
          text: resData.message || 'Song recognition service is not configured. Please add an AUDD_API_TOKEN to backend/.env.'
        });
      } else if (resData.success && resData.data) {
        setStatusMessage({
          type: 'success',
          text: `Identified: "${resData.data.title}" by ${resData.data.artist}!`
        });
        if (onSongIdentified) {
          onSongIdentified(resData.data);
        }
      } else {
        setStatusMessage({
          type: 'warning',
          text: resData.message || "We couldn't identify that recording. Try recording or uploading a clearer section of the song."
        });
      }
    } catch (error) {
      console.error('[Recorder] Recognition request failed:', error);
      setStatusMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Failed to communicate with music recognition server. Please try again.'
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const progressPercentage = (timerSeconds / MAX_RECORDING_SECONDS) * 100;

  return (
    <div className="recording-workstation">
      {/* Hidden File Input for Audio Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*,.mp3,.wav,.webm,.m4a,.ogg"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div className="recording-header">
        <h2 className="recording-title">
          <FiMic className="gradient-text" /> Identify a Song
        </h2>
        <p className="recording-desc">
          Play the song near your microphone or upload an audio file to identify it.
        </p>
      </div>

      {/* Dynamic Status / Feedback Message */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`banner banner-${statusMessage.type}`}
            style={{ maxWidth: '640px', width: '100%', textAlign: 'left' }}
          >
            {statusMessage.type === 'success' && <FiCheckCircle style={{ minWidth: '18px' }} />}
            {statusMessage.type === 'info' && <FiInfo style={{ minWidth: '18px' }} />}
            {statusMessage.type !== 'success' && statusMessage.type !== 'info' && (
              <FiAlertCircle style={{ minWidth: '18px' }} />
            )}
            <span>{statusMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Recording & Upload Area */}
      {!audioBlob && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
          <div className="mic-container">
            {isRecording && <div className="recording-pulse-ring" />}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`mic-btn ${isRecording ? 'recording' : ''}`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              {isRecording ? <FiSquare style={{ fontSize: '2.2rem' }} /> : <FiMic />}
            </button>
          </div>

          {/* Recording Timer and Visualizer */}
          {isRecording && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div className="recording-timer">
                00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds} / 00:15
              </div>

              {/* Progress bar */}
              <div className="recording-progress-bar">
                <div
                  className="recording-progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Animated visualizer waves */}
              <div className="audio-visualizer">
                {[0.1, 0.4, 0.2, 0.5, 0.3, 0.6, 0.2, 0.5, 0.1].map((delay, idx) => (
                  <div
                    key={idx}
                    className="visualizer-bar"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
              <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>
                Listening to audio... Click square to stop
              </p>
            </div>
          )}

          {!isRecording && (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Click the microphone button to start recording
              </p>

              {/* Upload Alternative */}
              <div className="upload-divider">
                <span>OR</span>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="upload-file-btn"
                title="Select an audio file from your device"
              >
                <FiUploadCloud style={{ fontSize: '1.2rem', color: 'var(--accent-purple)' }} />
                Upload Audio File (.mp3, .wav, .webm)
              </button>
            </>
          )}
        </div>
      )}

      {/* Audio Preview & Identification Actions */}
      {audioBlob && !isIdentifying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="audio-preview-box"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="audio-file-badge">
              <FiFileText /> {audioFileName || (isUploaded ? 'Uploaded Audio' : `Recording (${timerSeconds}s)`)}
            </span>
          </div>

          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            className="preview-audio-player"
            controls
          />

          <div className="recorder-actions">
            <button
              onClick={identifySong}
              className="btn-primary"
              title="Identify this recording"
            >
              <FiSearch /> Identify Song
            </button>
            {isUploaded ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                title="Choose another audio file"
              >
                <FiUploadCloud /> Choose Another File
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="btn-secondary"
                title="Record again"
              >
                <FiRotateCcw /> Re-record
              </button>
            )}
            <button
              onClick={deleteRecording}
              className="btn-logout"
              title="Discard audio"
            >
              <FiTrash2 /> Discard
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading state during identification */}
      {isIdentifying && (
        <Loading message="Identifying your song with SoundSpace..." />
      )}
    </div>
  );
};

export default Recorder;
