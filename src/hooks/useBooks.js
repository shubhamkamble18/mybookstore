import { useState, useEffect, useCallback } from 'react';
import { MOCK_BOOKS } from '../utils/mockBooks';

// Using Google Books API
export const useBooks = (initialQuery = 'subject:fiction', maxResults = 10) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(async (query, start, isNewQuery = false) => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    try {
      // Build Google Books API URL
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${start}&maxResults=${maxResults}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      
      if (data.items) {
        setBooks(prev => isNewQuery ? data.items : [...prev, ...data.items]);
        setHasMore(data.items.length === maxResults);
      } else {
        if (isNewQuery) setBooks([]);
        setHasMore(false);
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to mock data:', err.message);
      const fallbackItems = MOCK_BOOKS.slice(start, start + maxResults);
      setBooks(prev => isNewQuery ? fallbackItems : [...prev, ...fallbackItems]);
      setError(null); 
      setHasMore(fallbackItems.length === maxResults);
    } finally {
      setLoading(false);
    }
  }, [maxResults]);

  // Initial load
  useEffect(() => {
    fetchBooks(initialQuery, 0, true);
  }, [fetchBooks, initialQuery]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextIndex = startIndex + maxResults;
      setStartIndex(nextIndex);
      fetchBooks(initialQuery, nextIndex, false);
    }
  };

  return { books, loading, error, hasMore, loadMore };
};
