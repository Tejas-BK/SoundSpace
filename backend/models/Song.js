const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true
  },
  album: {
    type: String,
    default: 'Unknown Album'
  },
  image: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  previewUrl: {
    type: String,
    default: ''
  },
  spotifyUrl: {
    type: String,
    default: ''
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  artistId: {
    type: String,
    default: ''
  },
  artistImage: {
    type: String,
    default: ''
  },
  artistBio: {
    type: String,
    default: ''
  },
  relatedSongs: [
    {
      title: String,
      artist: String,
      album: String,
      image: String,
      spotifyUrl: String,
      youtubeUrl: String,
      previewUrl: String
    }
  ],
  externalId: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast text searches
songSchema.index({ title: 'text', artist: 'text', album: 'text' });

module.exports = mongoose.model('Song', songSchema);
