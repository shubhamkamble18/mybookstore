import { Search, Loader2 } from 'lucide-react';
import BookCard from './BookCard';
import { useBookContext } from '../context/BookContext';

const Books = () => {
  const { 
    searchResults, 
    searchLoading, 
    hasSearched, 
    totalItems, 
    activeQuery, 
    activeFilter, 
    applyFilter, 
    loadMore 
  } = useBookContext();

  // "displaying results only after search" requirement
  if (!hasSearched && !searchLoading) {
    return null;
  }

  const isAppending = searchLoading && searchResults.length > 0;

  return (
    <section className="py-20 bg-background dark:bg-gray-900 transition-colors border-t border-gray-100 dark:border-gray-800 min-h-[40vh]" id="search-results">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold font-heading text-gray-900 dark:text-white mb-2">
              Results for <span className="text-primary">"{activeQuery}"</span>
            </h2>
            {searchResults.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Found {totalItems > 1000 ? '1,000+' : totalItems} highly matched books</p>
            )}
          </div>
          
          {/* Advanced Filters */}
          {hasSearched && searchResults.length > 0 && (
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">
               {[
                 { id: 'relevance', label: 'Relevance' },
                 { id: 'newest', label: 'Newest' },
                 { id: 'free-ebooks', label: 'Free eBooks' }
               ].map((f) => (
                 <button 
                   key={f.id}
                   onClick={() => applyFilter(f.id)}
                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                     activeFilter === f.id 
                       ? 'bg-white dark:bg-gray-700 text-primary shadow-sm ring-1 ring-gray-200 dark:ring-gray-600' 
                       : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                   }`}
                 >
                   {f.label}
                 </button>
               ))}
            </div>
          )}
        </div>

        {/* Loading Initial State (Fresh Search) */}
        {searchLoading && searchResults.length === 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl aspect-[2/3] w-full border border-gray-200 dark:border-gray-700"></div>
             ))}
           </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 animate-in fade-in duration-500 mb-12">
              {searchResults.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>

            {/* Pagination / Load More */}
            {searchResults.length < totalItems && (
              <div className="flex justify-center mt-8 pt-4">
                <button 
                  onClick={loadMore}
                  disabled={isAppending}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full font-bold transition-colors disabled:opacity-50 ring-1 ring-gray-200 dark:ring-gray-700"
                >
                  {isAppending ? (
                    <><Loader2 className="w-5 h-5 animate-spin text-primary" /> Loading...</>
                  ) : (
                    'Load More Results'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No books found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find anything matching your exact filter criteria. Try expanding your search or selecting "Relevance".
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Books;
