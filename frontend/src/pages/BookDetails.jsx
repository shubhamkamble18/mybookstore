import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, BookOpen, Clock, Calendar, Globe, Zap, Bookmark } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import toINR from '../utils/currency';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, quickBuy } = useCartContext();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await res.json();
        
        const v = data.volumeInfo;
        const s = data.saleInfo;

        // Extract ISBN for OpenLibrary High-Res Attempt
        let isbn = null;
        if (v?.industryIdentifiers) {
           const idObj = v.industryIdentifiers.find(i => i.type === 'ISBN_13' || i.type === 'ISBN_10');
           if (idObj) isbn = idObj.identifier;
        }
        
        const highRes = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : null;
        let googleImg = v?.imageLinks?.thumbnail?.replace('http:', 'https:')?.replace('&edge=curl', '') || null;

        const apiPrice = s?.listPrice?.amount;
        const price = apiPrice ? Math.max(100, Math.min(Math.round(apiPrice * 85), 9999)) : (Math.floor(Math.random() * (999 - 100 + 1)) + 100);

        setBook({
          id: data.id,
          title: v?.title || 'Unknown Title',
          author: v?.authors?.join(', ') || 'Unknown Author',
          description: v?.description || 'No description available for this book.',
          publisher: v?.publisher || 'Unknown Publisher',
          publishedDate: v?.publishedDate || 'Unknown Date',
          pageCount: v?.pageCount || 'N/A',
          categories: v?.categories || [],
          rating: v?.averageRating || (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
          price: price,
          image: googleImg,
          highResImage: highRes,
        });

      } catch (error) {
        console.error("Error fetching book details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const [imgSrc, setImgSrc] = useState(null);
  
  useEffect(() => {
    if(book) {
      setImgSrc(book.highResImage || book.image);
    }
  }, [book]);

  const handleError = () => {
    if (imgSrc === book?.highResImage && book?.image) {
      setImgSrc(book.image);
    } else {
      setImgSrc(null);
    }
  };

  if (loading) {
     return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
           <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
               <p className="text-gray-500 font-medium">Loading Book Intel...</p>
           </div>
        </div>
     );
  }

  if (!book) {
     return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50 dark:bg-gray-900 transition-colors">
           <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
           <h2 className="text-2xl font-bold font-heading mb-2 text-gray-900 dark:text-white">Book Not Found</h2>
           <p className="text-gray-500 mb-6 max-w-sm">The specific volume you are looking for has been removed or is unavailable from the global catalog.</p>
           <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-primary transition-colors rounded-lg font-medium shadow-sm">
               Return Home
           </button>
        </div>
     );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 min-h-screen py-10 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary dark:text-gray-400 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to exploring
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 relative z-10">
            
            {/* Left Image & Metadata Section */}
            <div className="md:col-span-4 lg:col-span-4 xl:col-span-3 bg-gray-50 dark:bg-gray-900/50 p-8 flex flex-col items-center justify-start border-r border-gray-100 dark:border-gray-700 relative">
               <div className="w-full max-w-[240px] aspect-[2/3] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-700">
                  {imgSrc ? (
                    <img 
                      src={imgSrc} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                      onError={handleError}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-gray-400 text-center">
                       <BookOpen className="w-12 h-12 mb-2 opacity-30" />
                       <span className="text-xs font-semibold uppercase tracking-wider">No Preview Cover</span>
                    </div>
                  )}
               </div>
               
               {/* Quick Info Below Image */}
               <div className="w-full mt-10 space-y-4">
                 <div className="flex items-center justify-between text-sm py-3 border-b border-gray-200 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Clock className="w-4 h-4"/> Pages</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{book.pageCount}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm py-3 border-b border-gray-200 dark:border-gray-700/50">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Globe className="w-4 h-4"/> Publisher</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-right max-w-[120px] truncate" title={book.publisher}>
                       {book.publisher}
                    </span>
                 </div>
                 <div className="flex items-center justify-between text-sm py-3">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4"/> Published</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{book.publishedDate}</span>
                 </div>
               </div>
            </div>

            {/* Right Details Section */}
            <div className="md:col-span-8 lg:col-span-8 xl:col-span-9 p-8 md:p-12 flex flex-col">
              
              <div className="flex flex-wrap gap-2 mb-6">
                {book.categories.slice(0, 3).map((cat, idx) => (
                   <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full">
                     {cat}
                   </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white leading-tight mb-2 tracking-tight">
                {book.title}
              </h1>
              
              <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-8">By <span className="text-gray-800 dark:text-gray-200">{book.author}</span></p>
              
              <div className="flex items-center gap-6 mb-10 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl w-fit border border-gray-100 dark:border-gray-800">
                 <div className="flex items-center gap-1">
                   <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                   <span className="font-bold text-gray-900 dark:text-white text-lg">{Number(book.rating).toFixed(1)}</span>
                   <span className="text-sm text-gray-500 ml-1">Rating</span>
                 </div>
                 <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                 <div className="flex items-center gap-2">
                   <span className="text-3xl font-bold text-primary dark:text-primary-light">
                     {toINR(book.price)}
                   </span>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => {
                      quickBuy(book);
                      navigate('/checkout');
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
                    id="buy-now-btn"
                    title="Quick purchase - clears cart and buys only this book"
                  >
                    <Zap className="w-4 h-4" /> Buy Now
                  </button>
                  <button 
                    onClick={() => addToCart(book)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
                    id="add-to-cart-btn"
                  >
                    <Bookmark className="w-4 h-4" /> Add to Cart
                  </button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-heading flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Synopsis
                </h3>
                <div 
                  className="prose dark:prose-invert prose-primary max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
