import { ChevronLeft, ChevronRight, Star, ShoppingCart, ImageOff } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useBookContext } from '../context/BookContext';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Subcomponent to handle specific image fallback logic cleanly inside Swiper
const HeroBookCover = ({ book }) => {
  const [hasError, setHasError] = useState(false);
  
  let imgSrc = hasError ? book.image : (book.highResImage || book.image);
  if (hasError === 'fatal') imgSrc = null;

  const handleError = () => {
    if (!hasError && book.highResImage) {
      setHasError(true);
    } else {
      setHasError('fatal');
    }
  };

  return (
    <div className="relative w-56 sm:w-64 md:w-80 perspective-1000 group z-10">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/30 blur-2xl rounded-full opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:bg-primary/40"></div>
      
      {/* Book 3D Container */}
      <div className="relative bg-white rounded-r-2xl rounded-l-sm shadow-2xl overflow-hidden transform transition-all duration-700 md:rotate-y-[-10deg] md:group-hover:rotate-y-[-5deg] md:group-hover:scale-105 border-l-8 border-gray-200 dark:border-gray-300">
        <div className="aspect-[2/3] bg-gray-100 relative">
          {imgSrc ? (
            <img 
              src={imgSrc} 
              alt={book.title}
              className="w-full h-full object-cover"
              onError={handleError}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-gray-500 bg-gray-200 dark:bg-gray-700">
               <ImageOff className="w-12 h-12 mb-3 opacity-50" />
               <span className="text-sm font-bold line-clamp-3">{book.title}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const { carouselBooks } = useBookContext();
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!carouselBooks || carouselBooks.length === 0) return null;

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-white dark:bg-primary/5 opacity-20 blur-3xl mix-blend-overlay"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-primary/20 dark:bg-primary/10 blur-3xl mix-blend-overlay"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            slidesPerView={1}
            onSwiper={setSwiperInstance}
            pagination={{ clickable: true, dynamicBullets: true, el: '.custom-pagination' }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="w-full h-full pb-16"
          >
            {carouselBooks.map((book) => (
              <SwiperSlide key={book.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full px-2 lg:px-12">
                  
                  {/* Text Content */}
                  <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex flex-wrap items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/40 dark:bg-gray-800/60 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-sm text-sm font-medium text-primary-dark dark:text-primary-light">
                      <Star className="w-4 h-4 fill-primary dark:fill-primary-light text-primary dark:text-primary-light" />
                      <span>Featured Book</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-gray-900 dark:text-white leading-tight mb-4 drop-shadow-sm line-clamp-2">
                      {book.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
                      By {book.author}
                    </p>
                    
                    <div className="text-3xl font-bold text-primary dark:text-primary-light mb-8">
                      ${Number(book.price).toFixed(2)}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      <button className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium text-lg transition-all duration-300 shadow-xl shadow-primary/30 transform hover:-translate-y-1 group">
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" /> Add to Cart 
                      </button>
                      <button className="flex items-center justify-center px-8 py-4 bg-white/60 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium text-lg border border-white dark:border-gray-700 transition-all backdrop-blur-sm shadow-sm hover:shadow-md">
                        Read Extract
                      </button>
                    </div>
                  </div>

                  {/* Featured Book Showcase */}
                  <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative items-center py-8">
                     <HeroBookCover book={book} />
                  </div>
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation & Pagination Container */}
          <button 
             onClick={() => swiperInstance?.slidePrev()}
             className="absolute top-1/2 -translate-y-1/2 left-0 lg:-left-4 z-20 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all hover:scale-110 border border-gray-100 dark:border-gray-700 hidden md:flex"
             aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
             onClick={() => swiperInstance?.slideNext()}
             className="absolute top-1/2 -translate-y-1/2 right-0 lg:-right-4 z-20 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur shadow-lg flex items-center justify-center text-gray-800 dark:text-gray-200 transition-all hover:scale-110 border border-gray-100 dark:border-gray-700 hidden md:flex"
             aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination */}
          <div className="custom-pagination absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-4"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
