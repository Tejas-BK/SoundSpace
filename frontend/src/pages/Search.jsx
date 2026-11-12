import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiMusic, FiInbox } from 'react-icons/fi';
import SongCard from '../components/SongCard';
import ArtistCard from '../components/ArtistCard';
import Loading from '../components/Loading';
import api from '../services/api';
import '../styles/search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'songs';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Perform search API call
  const performSearch = async (searchTerm, searchCategory) => {
    if (!searchTerm || !searchTerm.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get(`/songs/search?q=${encodeURIComponent(searchTerm.trim())}&category=${searchCategory}`);
      if (res.data && res.data.success) {
        setResults(res.data.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('[Search] Error performing search:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Sync search when URL query parameters change or on initial mount
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, category);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim(), category });
      performSearch(query.trim(), category);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (query.trim()) {
      setSearchParams({ q: query.trim(), category: newCategory });
      performSearch(query.trim(), newCategory);
    }
  };

  return (
    <div className="search-page">
      {/* Header & Search Bar */}
      <div className="search-header-area">
        <h1 className="search-page-title">
          Explore <span className="gradient-text">Music & Artists</span>
        </h1>

        <form onSubmit={handleSubmit} className="search-form-wrapper">
          <FiSearch className="search-icon-inline" />
          <input
            type="text"
            className="search-input-inline"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary search-btn-inline">
            Search
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="search-categories">
          {['songs', 'artists', 'albums'].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && <Loading message={`Searching ${category} for "${query}"...`} />}

      {/* Search Results Grid */}
      {!loading && searched && results.length > 0 && (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
            Found {results.length} results for "<strong style={{ color: 'var(--text-primary)' }}>{query}</strong>"
          </p>

          {category === 'artists' ? (
            <div className="artists-grid">
              {results.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="results-grid">
              {results.map((song, idx) => (
                <SongCard key={song._id || song.externalId || idx} song={song} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State when search returns 0 items */}
      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <FiInbox className="empty-icon" />
          <h3 className="empty-title">No results found</h3>
          <p className="empty-subtitle">
            We couldn't find any {category} matching "{query}". Try checking your spelling or searching another artist or song name.
          </p>
        </div>
      )}

      {/* Initial state before user searches */}
      {!loading && !searched && (
        <div className="empty-state">
          <FiMusic className="empty-icon" style={{ color: 'rgba(139, 92, 246, 0.4)' }} />
          <h3 className="empty-title">Discover Something New</h3>
          <p className="empty-subtitle">
            Type a song name, artist, or album title above to search through our global catalog.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
