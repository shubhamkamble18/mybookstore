import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Moon, Sun, Loader, BookOpen, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useBookContext } from '../context/BookContext';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = ({ toggleTheme, isDark }) => {
  const { searchLoading, searchBooks, liveSearch, liveSearchResults, liveSearchLoading, clearLiveSearch } = useBookContext();
  const { totalItems } = useCartContext();
  const { currentUser, logOut } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle clicking outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowDropdown(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        liveSearch(searchQuery.trim());
      } else {
        clearLiveSearch();
      }
    }, 400); 
    return () => clearTimeout(timeoutId);
  }, [searchQuery, liveSearch, clearLiveSearch]);

  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      await searchBooks(searchQuery.trim());
      if (location.pathname !== '/') {
        navigate('/');
      }
      setTimeout(() => {
        const el = document.getElementById('search-results');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">M</div>
            <span className="font-heading font-bold text-2xl tracking-tight text-gray-900 dark:text-white hidden md:block">
              MyBook<span className="text-primary">Store</span>
            </span>
          </Link>

          <nav className="hidden xl:flex space-x-8">
            {['Home', 'Categories', 'Blog'].map((item) => (
              <a key={item} href={`/#${item.toLowerCase()}`} className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm tracking-wide transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex-1 max-w-xl relative mx-auto" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input 
                type="text" 
                placeholder="Search millions of books..." 
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 outline-none transition-all shadow-inner border border-transparent"
              />
              <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center cursor-pointer">
                {searchLoading ? <Loader className="w-4 h-4 text-primary animate-spin" /> : <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />}
              </button>
            </form>

            {showDropdown && searchQuery.trim().length >= 2 && (
              <div className="absolute top-12 left-0 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {liveSearchLoading ? (
                  <div className="flex items-center justify-center p-6 text-gray-500">
                    <Loader className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : liveSearchResults.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto w-full">
                    {liveSearchResults.map((book) => (
                      <Link
                        key={book.id}
                        to={`/book/${book.id}`}
                        onClick={() => {
                          setShowDropdown(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                      >
                         <div className="w-12 h-16 bg-gray-100 dark:bg-gray-900 rounded flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {book.image ? (
                               <img src={book.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <BookOpen className="w-4 h-4 text-gray-400" />
                            )}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{book.title}</h4>
                           <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                         </div>
                         <div className="font-bold text-primary dark:text-primary-light text-sm px-2">
                            ${Number(book.price).toFixed(2)}
                         </div>
                      </Link>
                    ))}
                    <div 
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-center text-sm font-medium text-primary hover:bg-primary/5 cursor-pointer border-t border-gray-100 dark:border-gray-700 transition-colors block"
                    >
                      View all results for "{searchQuery}"
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No immediate matches found for "{searchQuery}". Try pressing enter to search the full catalog.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">
            
            {/* Account Management */}
            <div className="relative" ref={profileRef}>
              {currentUser ? (
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold shadow-sm hover:ring-2 hover:ring-primary/50 transition-all overflow-hidden cursor-pointer focus:outline-none"
                >
                  {currentUser.photoURL ? (
                     <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} className="w-full h-full object-cover" />
                  ) : (
                     <span>{(currentUser.displayName || currentUser.email || "U")[0].toUpperCase()}</span>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-white hover:bg-primary transition-colors font-semibold text-sm border border-transparent shadow-sm hover:shadow"
                >
                  <User className="w-4 h-4" /> <span className="hidden sm:block">Sign In</span>
                </button>
              )}

              {/* Profile Dropdown */}
              {showProfileMenu && currentUser && (
                <div className="absolute top-12 right-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{currentUser.displayName || 'Book Lover'}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="py-1">
                      <Link to="/cart" onClick={() => setShowProfileMenu(false)} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors">
                        <ShoppingCart className="w-4 h-4 text-gray-400" /> My Orders
                      </Link>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700">
                      <button 
                        onClick={() => {
                          logOut();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="hidden sm:flex w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary items-center justify-center transition-colors">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors relative block p-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 -right-1 sm:-right-2 transform translate-x-1 -translate-y-1 bg-secondary text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center animate-in zoom-in shadow-md">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};

export default Navbar;
