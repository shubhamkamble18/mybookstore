import { Star, MessageCircle, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import backend from '../api/backend';

const Reviews = () => {
  const scrollContainerRef = useRef(null);
  const [liveReviews, setLiveReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await backend.get('/api/reviews/');
      setLiveReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;
    
    setSubmitting(true);
    try {
      const res = await backend.post('/api/reviews/', formData);
      setLiveReviews([res.data, ...liveReviews]);
      setIsModalOpen(false);
      setFormData({ name: '', rating: 5, text: '' });
      // Scroll back to the start to show the new review
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const defaultReviews = [
    {
      id: "default-1",
      name: "Aarav Sharma",
      rating: 5,
      role: "Fiction Enthusiast",
      text: "The selection of regional and international fiction is amazing. I ordered a hard-to-find novel and it arrived in perfect condition within two days!"
    },
    {
      id: "default-2",
      name: "Priya Desai",
      rating: 5,
      role: "UPSC Aspirant",
      text: "This bookstore is a lifesaver for student preparation. They have all the latest editions of competitive exam books at very reasonable prices compared to local markets."
    },
    {
      id: "default-3",
      name: "Rohan Kapoor",
      rating: 4,
      role: "Comic Collector",
      text: "Great packaging. Graphic novels often get damaged in transit, but mine was securely bubble-wrapped. Would love to see more manga titles added to the collection."
    },
    {
      id: "default-4",
      name: "Ananya Iyer",
      rating: 5,
      role: "Book Blogger",
      text: "I buy books almost every week, and the checkout system here is fantastic. Fast delivery across India and the UI is incredibly smooth!"
    }
  ];

  const allReviews = [...liveReviews, ...defaultReviews];

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
          
          <div className="flex gap-2 sm:gap-4 items-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm hidden sm:block mr-2"
            >
              Write Review
            </button>
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
          {allReviews.map((review) => (
            <div 
              key={review.id} 
              className="flex-none w-[85vw] sm:w-[400px] snap-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 relative group"
            >
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
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 relative z-10 leading-relaxed italic line-clamp-4">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-gray-50 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl font-heading border border-primary/20 flex-shrink-0">
                  {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{review.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{review.role || 'Reader'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2">Share Your Experience</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your feedback helps fellow readers make better choices.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  maxLength={50}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className={`p-2 rounded-full transition-colors ${formData.rating >= star ? 'bg-yellow-50 dark:bg-yellow-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                      <Star className={`w-6 h-6 ${formData.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Your Review</label>
                <textarea 
                  required
                  maxLength={300}
                  rows={4}
                  value={formData.text}
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all resize-none"
                  placeholder="What did you love about your purchase?"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
