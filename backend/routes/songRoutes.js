const express = require('express');
const router = express.Router();
const {
  searchSongs,
  recognizeSong,
  getSongDetails,
  getArtistDetails
} = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/search', searchSongs);
router.post('/recognize', protect, upload.single('audio'), recognizeSong);
router.get('/artist/:id', getArtistDetails);
router.get('/:id', getSongDetails);

module.exports = router;
