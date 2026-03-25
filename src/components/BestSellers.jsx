import { ArrowRight } from 'lucide-react';
import BookCard from './BookCard';
import { useBookContext } from '../context/BookContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BestSellers = () => {
  const { bestsellers, initialLoading } = useBookContext();

  return (
    <section className="py-20 bg-background dark:bg-gray-900 transition-colors" id="bestsellers">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              Best Selling <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Books</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover our most popular books that readers around the world are loving right now. 
            </p>
          </div>
          
          <button className="hidden sm:flex items-center gap-2 font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors group whitespace-nowrap">
            View All Bestsellers 
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {initialLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl aspect-[2/3] w-full border border-gray-200 dark:border-gray-700"></div>
            ))}
          </div>
        ) : bestsellers.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
            className="pb-12"
          >
            {bestsellers.map((book) => (
              <SwiperSlide key={book.id} className="h-auto pb-4 pt-4">
                 <BookCard {...book} variant="bestseller" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12 text-gray-500">Failed to load Best Sellers dynamically from Google Books.</div>
        )}
        
      </div>
    </section>
  );
};
export default BestSellers;
