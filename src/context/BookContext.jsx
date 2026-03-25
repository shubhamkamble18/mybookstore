/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const BookContext = createContext(null);

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

const formatBook = (item) => {
  const v = item.volumeInfo;
  const s = item.saleInfo;
  
  let googleImage = v?.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                    v?.imageLinks?.smallThumbnail?.replace('http:', 'https:') || null;
                    
  if(googleImage) {
     googleImage = googleImage.replace('&edge=curl', ''); 
  }

  let isbn = null;
  if (v?.industryIdentifiers) {
     const idObj = v.industryIdentifiers.find(id => id.type === 'ISBN_13' || id.type === 'ISBN_10');
     if (idObj) isbn = idObj.identifier;
  }
  
  const highResImage = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : null;

  const defaultPrice = (Math.floor(Math.random() * (25 - 9)) + 9) + 0.99;
  const price = s?.listPrice?.amount || defaultPrice;

  return {
    id: item.id,
    title: v?.title || 'Unknown Title',
    author: v?.authors?.join(', ') || 'Unknown Author',
    price: price,
    image: googleImage,
    highResImage: highResImage,
    rating: v?.averageRating || (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
  };
};

export const BookProvider = ({ children }) => {
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [carouselBooks, setCarouselBooks] = useState([]);
  
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Pagination and Filters State
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [activeFilter, setActiveFilter] = useState('relevance');
  const [activeQuery, setActiveQuery] = useState('');
  
  const [liveSearchResults, setLiveSearchResults] = useState([]);
  const [liveSearchLoading, setLiveSearchLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialLoading(true);
      try {
        const fetchCarousel = fetch(`${GOOGLE_BOOKS_API}?q=subject:fiction+bestseller+award&orderBy=relevance&maxResults=5`).then(res => res.json());
        const fetchBestsellersReq = fetch(`${GOOGLE_BOOKS_API}?q=subject:thriller+bestseller&orderBy=relevance&maxResults=10`).then(res => res.json());
        const fetchNewReq = fetch(`${GOOGLE_BOOKS_API}?q=history+technology&orderBy=newest&maxResults=8`).then(res => res.json());

        const [carouselData, bestsellersData, newArrivalsData] = await Promise.all([
          fetchCarousel, fetchBestsellersReq, fetchNewReq
        ]);

        if (carouselData.items) setCarouselBooks(carouselData.items.map(formatBook));
        if (bestsellersData.items) setBestsellers(bestsellersData.items.map(formatBook));
        if (newArrivalsData.items) setNewArrivals(newArrivalsData.items.map(formatBook));
        
      } catch (error) {
        console.error("Failed fetching initial books", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const searchBooks = useCallback(async (query, start = 0, append = false, filter = 'relevance') => {
    if (!query) {
       setSearchResults([]);
       setHasSearched(false);
       setTotalItems(0);
       return [];
    }
    
    // Save state for pagination reference
    setActiveQuery(query);
    setActiveFilter(filter);
    setStartIndex(start);
    setHasSearched(true);
    setSearchLoading(true);
    
    try {
      const orderBy = filter === 'newest' ? '&orderBy=newest' : '&orderBy=relevance';
      const filterStr = filter === 'free-ebooks' ? '&filter=free-ebooks' : '';
      
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}${orderBy}${filterStr}&maxResults=20&startIndex=${start}`);
      const data = await response.json();
      
      setTotalItems(data.totalItems || 0);
      
      const formatted = data.items ? data.items.map(formatBook) : [];
      
      if (append) {
        setSearchResults(prev => {
          // Prevent duplicates if API acts weird
          const existingIds = new Set(prev.map(b => b.id));
          const novel = formatted.filter(b => !existingIds.has(b.id));
          return [...prev, ...novel];
        });
      } else {
        setSearchResults(formatted);
      }
      return formatted;
    } catch (error) {
       console.error("Search failed", error);
       if (!append) setSearchResults([]);
       return [];
    } finally {
       setSearchLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (activeQuery && searchResults.length < totalItems) {
      searchBooks(activeQuery, startIndex + 20, true, activeFilter);
    }
  }, [activeQuery, searchResults.length, totalItems, startIndex, activeFilter, searchBooks]);
  
  const applyFilter = useCallback((newFilter) => {
    if (activeQuery && newFilter !== activeFilter) {
      searchBooks(activeQuery, 0, false, newFilter);
    }
  }, [activeQuery, activeFilter, searchBooks]);

  const liveSearch = useCallback(async (query) => {
    if (!query || query.length < 2) {
       setLiveSearchResults([]);
       return [];
    }
    
    setLiveSearchLoading(true);
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=5`);
      const data = await response.json();
      const formatted = data.items ? data.items.map(formatBook) : [];
      setLiveSearchResults(formatted);
      return formatted;
    } catch (error) {
      console.error("Live Search failed", error);
      setLiveSearchResults([]);
      return [];
    } finally {
      setLiveSearchLoading(false);
    }
  }, []);

  const clearLiveSearch = useCallback(() => setLiveSearchResults([]), []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setHasSearched(false);
    setTotalItems(0);
    setActiveQuery('');
    setStartIndex(0);
  }, []);

  return (
    <BookContext.Provider value={{ 
      bestsellers, 
      newArrivals, 
      carouselBooks,
      
      searchResults,
      searchLoading,
      hasSearched,
      totalItems,
      activeQuery,
      activeFilter,
      applyFilter,
      loadMore,
      
      initialLoading,
      searchBooks,
      clearSearch,
      
      liveSearchResults,
      liveSearchLoading,
      liveSearch,
      clearLiveSearch
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => useContext(BookContext);
