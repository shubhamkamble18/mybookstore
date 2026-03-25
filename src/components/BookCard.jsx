import { Star, ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const BookCard = ({ id, title, author, price, image, highResImage, rating, variant = 'default' }) => {
  const { addToCart } = useCartContext();
  const [hasError, setHasError] = useState(false);
  
  // Derived state to handle fast-refresh cleanly
  let imgSrc = hasError ? image : (highResImage || image);
  if (hasError === 'fatal') imgSrc = null;

  const isBestseller = variant === 'bestseller';
  const isNew = variant === 'new';

  let containerClasses = "group flex flex-col rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden relative h-full ";
  if (isBestseller) {
    containerClasses += "bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-900/30 hover:shadow-xl hover:shadow-amber-100 dark:hover:-translate-y-1";
  } else if (isNew) {
    containerClasses += "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 hover:shadow-lg hover:border-indigo-300";
  } else {
    containerClasses += "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-primary/20";
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, author, price, image, rating });
  };

  const handleError = () => {
    if (!hasError && highResImage) {
      setHasError(true);
    } else {
      setHasError('fatal');
    }
  };

  return (
    <div className={containerClasses}>
      {/* Badges */}
      {isBestseller && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" /> Bestseller
        </div>
      )}
      {isNew && (
        <div className="absolute top-4 left-4 z-10 bg-indigo-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
          New
        </div>
      )}

      {/* Book Cover */}
      <Link to={`/book/${id}`} className="relative aspect-[2/3] overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6 cursor-pointer block">
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={title} 
            loading="lazy"
            className={`w-full h-full object-cover rounded shadow-md transition-transform duration-500 max-h-[280px] md:max-h-[320px] ${isBestseller ? 'group-hover:scale-110' : 'group-hover:scale-105'}`}
            onError={handleError}
          />
        ) : null}
        
        {/* Fallback */}
        <div className={`w-full h-full bg-gray-200 dark:bg-gray-700 rounded shadow-md flex flex-col items-center justify-center text-gray-400 p-4 ${imgSrc ? 'hidden' : 'flex'}`}>
           <ImageOff className="w-10 h-10 mb-2 opacity-50" />
           <span className="text-[10px] font-medium text-center line-clamp-3">{title}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{Number(rating || 0).toFixed(1)}</span>
        </div>
        
        <Link to={`/book/${id}`}>
          <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-base leading-tight mb-1 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 line-clamp-1">{author}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">${Number(price).toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2.5 rounded-xl transition-colors shadow-sm"
            aria-label="Add to Cart"
          >
             <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
