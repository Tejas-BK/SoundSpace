# 🎵 SoundSpace - Music Discovery & Identification Platform

**SoundSpace** is a modern, full-stack MERN music discovery and audio identification web application built as a college BCA major project. It enables users to record short audio clips through their browser microphone or manually search songs and artists to discover song titles, artist biographies, album artwork, release metadata, direct Spotify and YouTube streaming links, and related tracks.

---

## 🌟 Key Features

1. **Microphone Audio Recording & File Upload (`Recorder.jsx`)**:
   - Browser audio capture using modern `MediaRecorder` & cross-browser `getUserMedia` fallback.
   - **Direct Audio File Upload Alternative**: Users can also directly upload audio files (`.mp3`, `.wav`, `.webm`, `.m4a`, `.ogg`) from their computer to preview and identify songs.
   - Secure context detection: Automatically detects whether the page is loaded on `localhost` or an insecure network IP and provides immediate guidance.
   - Live visualizer pulse ring and equalizer wave animation.
   - 15-second recording timer with automatic cutoff.
   - Built-in HTML5 playback preview before submission.
   - Actions to re-record, choose another file, discard, or identify the audio.

2. **Song Recognition Architecture (`musicService.js`)**:
   - Modular abstraction designed to accept acoustic fingerprinting services (such as [AudD Music Recognition API](https://audd.io/) or ACRCloud).
   - Graceful fallback: If recognition credentials are not provided in `.env`, the application clearly explains how to configure them without throwing errors or crashing the server.
   - Temporary uploaded files in `backend/uploads/` are safely deleted after processing.

3. **Live Music Catalog & Search**:
   - Live search across songs, artists, and albums.
   - High-resolution album artwork processing (upgraded to 600x600).
   - 30-second audio previews streamed directly from high-fidelity previews.
   - Direct external links to **Spotify** and **YouTube** searches for every track.

4. **Artist Discography & Biographies**:
   - Artist details view with verified biographical summaries fetched dynamically from Wikipedia's public REST API (zero extra keys required).
   - Top tracks and popular releases for the selected artist.

5. **MongoDB Caching**:
   - Automatically caches searched and recognized songs into MongoDB to minimize redundant external queries and speed up subsequent loads.

6. **Secure JWT Authentication**:
   - Full user registration and login workflow.
   - Passwords securely hashed with `bcryptjs` (salt rounds: 10).
   - JWT authentication tokens stored in `localStorage` and automatically attached via Axios interceptors.
   - Protected routes (`/dashboard`) requiring a valid Bearer token.

7. **Dark Cinematic Music UI**:
   - Obsidian & charcoal glassmorphism theme with electric purple and blue gradient accents.
   - Responsive layouts optimized for Desktop, Tablets, and Mobile phones.
   - Smooth transitions and subtle animations powered by `framer-motion`.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite build tool)
- **JavaScript (ES6+)**
- **React Router DOM v6** (Client-side routing & protected routes)
- **Axios** (API requests with authorization interceptors)
- **React Icons** (FontAwesome, Ionicons, Feather icons)
- **Framer Motion** (Subtle UI animations and transitions)
- **CSS3** (Modular stylesheets with CSS custom properties & media queries)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database modeling & indexing)
- **JSON Web Token (`jsonwebtoken`)** (Stateless authentication)
- **`bcryptjs`** (Password hashing)
- **`multer`** (Multipart audio file upload handling)
- **`dotenv`** (Environment variable management)
- **`cors`** (Cross-Origin Resource Sharing)

---

## 📂 Project Structure

```
SoundSpace/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive navbar with auth state & mobile drawer
│   │   │   ├── SongCard.jsx         # Card with artwork, links to Spotify/YouTube/Details
│   │   │   ├── Recorder.jsx         # MediaRecorder microphone workflow & player
│   │   │   ├── ArtistCard.jsx       # Artist avatar and profile navigation
│   │   │   ├── Loading.jsx          # Animated equalizer loader
│   │   │   └── ProtectedRoute.jsx   # Route guard for authenticated pages
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Cinematic landing page
│   │   │   ├── Login.jsx            # User login page
│   │   │   ├── Register.jsx         # User registration page
│   │   │   ├── Dashboard.jsx        # Protected dashboard with recorder & quick search
│   │   │   ├── Search.jsx           # Music catalog search with filters
│   │   │   ├── SongDetails.jsx      # Song details, preview audio, & related tracks
│   │   │   └── ArtistDetails.jsx    # Artist profile, biography, & popular releases
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # User state & JWT persistence
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with auth interceptor
│   │   ├── styles/
│   │   │   ├── index.css            # Global CSS tokens, resets & typography
│   │   │   ├── App.css              # Navbar, footer, banners, layout
│   │   │   ├── auth.css             # Authentication cards
│   │   │   ├── home.css             # Landing page hero & features
│   │   │   ├── dashboard.css        # Recording workstation & dashboard
│   │   │   ├── search.css           # Search input, pills & grids
│   │   │   └── details.css          # Song & artist details hero layouts
│   │   ├── App.jsx                  # Main router setup
│   │   └── main.jsx                 # React root
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── backend/
    ├── config/
    │   └── db.js                    # MongoDB connection configuration
    ├── controllers/
    │   ├── authController.js        # Register, login, getMe handlers
    │   └── songController.js        # Search, recognize, details handlers
    ├── middleware/
    │   ├── authMiddleware.js        # JWT verification middleware
    │   └── uploadMiddleware.js      # Multer file size & format filter
    ├── models/
    │   ├── User.js                  # User schema with bcrypt pre-save hook
    │   └── Song.js                  # Song schema with MongoDB caching
    ├── routes/
    │   ├── authRoutes.js            # /api/auth routes
    │   └── songRoutes.js            # /api/songs routes
    ├── services/
    │   └── musicService.js          # Recognition service & music catalog search
    ├── uploads/                     # Temporary folder for audio uploads
    ├── .env                         # Environment configurations
    ├── .gitignore
    ├── package.json
    └── server.js                    # Express app entry point
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI.

---

### 1. Backend Setup

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Verify or edit `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/soundspace
   JWT_SECRET=soundspace_super_secret_jwt_key_college_project_2025

   # Optional: Music Recognition Provider Token
   AUDD_API_TOKEN=
   ```

4. Start the backend server:
   ```bash
   # Production mode:
   npm start

   # Development mode (with nodemon):
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

---

### 2. Frontend Setup

1. Open another terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Verify `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (name, email, password) |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get profile details of logged-in user |

### Songs & Discovery (`/api/songs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/songs/search?q=...&category=...` | Public | Search tracks, artists, or albums |
| `POST` | `/api/songs/recognize` | Private | Upload audio recording (`multipart/form-data`) |
| `GET` | `/api/songs/:id` | Public | Get detailed track info, artwork, & related tracks |
| `GET` | `/api/songs/artist/:id` | Public | Get artist biography & popular releases |

---

## 🎙️ Music Recognition Provider Configuration

SoundSpace implements a clean service abstraction in `backend/services/musicService.js`:

- **Out of the box**: Live search, previews, artist discographies, and Wikipedia bio summaries work immediately.
- **Audio Recognition**: To identify arbitrary live microphone recordings, obtain a free API token from [AudD.io](https://audd.io/) and paste it into `backend/.env`:
  ```env
  AUDD_API_TOKEN=your_token_here
  ```
- **If unconfigured**: SoundSpace alerts the user with a friendly notification explaining that audio recognition requires the token, while allowing microphone testing and manual discovery without throwing server errors.

---

## 🎓 BCA Project Presentation Highlights

When demonstrating this project to professors and evaluators:
1. **Separation of Concerns**: Show the clean decoupling between the client (`frontend/`), business controllers (`controllers/`), service layer (`services/musicService.js`), and database models (`models/`).
2. **Security**: Explain that passwords are salted and hashed using `bcryptjs` before reaching MongoDB, and that protected routes enforce JWT token verification.
3. **Audio Handling**: Demonstrate the Web Audio / MediaRecorder browser pipeline, the real-time audio visualizer, preview playback, and Multer file cleanup.
4. **Performance**: Highlight MongoDB caching which saves external API quota and accelerates repeated song lookups.
