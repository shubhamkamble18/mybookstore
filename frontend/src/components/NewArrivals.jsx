import { ArrowRight, Sparkles } from 'lucide-react';
import BookCard from './BookCard';
import { useBookContext } from '../context/BookContext';

const NewArrivals = () => {
  const { newArrivals, initialLoading } = useBookContext();

  return (
    <section className="py-24 bg-indigo-50/50 dark:bg-gray-800/50 transition-colors border-y border-indigo-100 dark:border-gray-800" id="new-arrivals">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium text-sm mb-4">
            <Sparkles className="w-4 h-4" /> Just Arrived
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 dark:text-white mb-6">
            Fresh Off The <span className="text-indigo-600 dark:text-indigo-400">Press</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
            Be the first to read our newly added collection. From gripping thrillers to inspiring biographies, find your next obsession here.
          </p>
        </div>

        {initialLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-12">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-indigo-100/50 dark:bg-gray-800 rounded-2xl aspect-[2/3] w-full border border-indigo-200 dark:border-gray-700"></div>
             ))}
           </div>
        ) : newArrivals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 mb-12">
              {newArrivals.slice(0, 4).map((book) => (
                 <BookCard key={book.id} {...book} variant="new" />
              ))}
            </div>
            <div className="flex justify-center">
               <button className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-500 text-gray-900 dark:text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md group">
                  Explore All New Releases
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400" />
               </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Failed to load New Arrivals dynamically.</div>
        )}
        
      </div>
    </section>
  );
};
export default NewArrivals;
