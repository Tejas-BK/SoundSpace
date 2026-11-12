const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, `audio-${uniqueSuffix}${ext}`);
  }
});

// Allowed audio MIME types
const allowedMimeTypes = [
  'audio/webm',
  'audio/ogg',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/mp3',
  'audio/mpeg',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'video/webm' // Chrome/Firefox occasionally records MediaRecorder audio stream as video/webm container
];

// File filter function
const fileFilter = (req, file, cb) => {
  const isAudioMime = allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/');
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.webm', '.ogg', '.wav', '.mp3', '.m4a', '.mp4'];
  const isAudioExt = allowedExtensions.includes(ext) || ext === '';

  if (isAudioMime || isAudioExt) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported audio format (${file.mimetype || ext}). Supported formats: WebM, MP3, WAV, M4A, OGG.`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
