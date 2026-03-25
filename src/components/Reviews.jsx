import { Star, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const Reviews = () => {
  const scrollContainerRef = useRef(null);

  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      role: "Avid Reader",
      text: "The selection here is unparalleled. I always find the specific editions I'm looking for, and the delivery is incredibly fast. My go-to bookstore!"
    },
    {
      id: 2,
      name: "Michael Chen",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      role: "Book Club Member",
      text: "I purchased 10 copies for our monthly book club. The packaging was pristine, and everyone loved the complimentary bookmarks. Great service."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      photo: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 4,
      role: "Student",
      text: "Love the student discounts and the vast array of educational materials. The website is super easy to navigate and find what I need quickly."
    },
    {
      id: 4,
      name: "David Smith",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      role: "Collector",
      text: "As a collector of rare books, I appreciate the detailed descriptions and condition reports provided. A very trustworthy source for serious buyers."
    }
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-primary/5 dark:bg-gray-800/50 relative overflow-hidden transition-colors">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-primary/10 dark:border-primary/20 text-primary dark:text-primary-light font-medium text-sm transition-colors">
              <MessageCircle className="w-4 h-4" />
              Customer Stories
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-4 leading-tight transition-colors">
              What Our Readers <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Say</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all hover:-translate-x-1"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-all hover:translate-x-1"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="flex-none w-[85vw] sm:w-[400px] snap-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 relative group"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-8 text-primary/5 dark:text-primary/10 font-serif text-8xl leading-none select-none group-hover:text-primary/10 transition-colors">
                "
              </div>
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 dark:fill-gray-700 text-gray-200 dark:text-gray-600'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 relative z-10 leading-relaxed italic">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-gray-50 dark:border-gray-700">
                <img 
                  src={review.photo} 
                  alt={review.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 p-0.5"
                />
                <div>
                  <h4 className="font-heading font-bold text-gray-900 dark:text-white text-lg">{review.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
