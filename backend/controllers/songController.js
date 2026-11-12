const musicService = require('../services/musicService');

/**
 * @desc    Search songs, artists, or albums
 * @route   GET /api/songs/search?q=...&category=...
 * @access  Public
 */
const searchSongs = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const category = req.query.category || 'songs';

    if (!query.trim()) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const results = await musicService.searchMusic(query, category);

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Recognize a recorded audio file
 * @route   POST /api/songs/recognize
 * @access  Private
 */
const recognizeSong = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded. Please record an audio clip first.'
      });
    }

    const result = await musicService.identifySong(req.file.path);

    if (result.configured === false) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: result.message
      });
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        configured: true,
        data: result.data
      });
    } else {
      return res.status(200).json({
        success: false,
        configured: true,
        message: result.message
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed information for a single song
 * @route   GET /api/songs/:id
 * @access  Public
 */
const getSongDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await musicService.getSongById(id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get artist profile, biography, and popular songs
 * @route   GET /api/songs/artist/:id
 * @access  Public
 */
const getArtistDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await musicService.getArtistById(id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist details not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: artist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchSongs,
  recognizeSong,
  getSongDetails,
  getArtistDetails
};
