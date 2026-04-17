import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Zap } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import toINR from '../utils/currency';
import { Link, useNavigate } from 'react-router-dom';


const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, quickBuy } = useCartContext();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
          Looks like you haven't added any books yet. Discover your next favorite read in our collection!
        </p>
        <Link 
          to="/" 
          className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold transition-all shadow-sm hover:-translate-y-1"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 min-h-screen py-12 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-2">
           Saved Books
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 text-sm">
          {cartItems.length} {cartItems.length === 1 ? 'book' : 'books'} saved for later — hit <strong>Buy Now</strong> when you're ready!
        </p>
        
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-5 items-center sm:items-start transition-all hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600 group"
            >
              {/* Image */}
              <Link to={`/book/${item.id}`} className="w-20 h-28 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-center text-gray-400 p-2 font-medium">
                    No Image
                  </div>
                )}
              </Link>
              
              {/* Details */}
              <div className="flex-1 flex flex-col text-center sm:text-left min-w-0">
                <Link to={`/book/${item.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                </Link>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{item.author}</p>
                <div className="font-bold text-primary dark:text-primary-light text-xl mt-3">
                  {toINR(item.price)}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-3 flex-shrink-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Buy Now Button */}
                <button 
                  onClick={() => {
                    quickBuy(item);
                    navigate('/checkout');
                  }}
                  className="flex items-center justify-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  id={`buy-now-${item.id}`}
                  title="Buy only this book"
                >
                  <Zap className="w-3.5 h-3.5" /> Buy Now
                </button>
                
                {/* Remove */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center pt-6 px-1">
          <Link to="/" className="text-primary hover:text-primary-dark font-semibold text-sm transition-colors flex items-center gap-1.5">
             <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <button 
            onClick={clearCart}
            className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors py-2"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper icon
const ArrowLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
)

export default CartPage;
