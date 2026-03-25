import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import CartPage from './pages/CartPage';
import { BookProvider } from './context/BookContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  // Theme state logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <AuthProvider>
      <BookProvider>
        <CartProvider>
          <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100 bg-background dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
          <Navbar toggleTheme={toggleTheme} isDark={isDark} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book/:id" element={<BookDetails />} />
              <Route path="/cart" element={<CartPage />} />
              {/* Fallback route */}
              <Route path="*" element={
                <div className="flex-grow flex items-center justify-center min-h-[50vh]">
                  <div className="text-center">
                     <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                     <Link to="/" className="text-primary hover:underline">Return to Home</Link>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        </BrowserRouter>
      </CartProvider>
    </BookProvider>
    </AuthProvider>
  );
}

export default App;
