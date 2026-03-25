import { ArrowRight, Calendar, User } from 'lucide-react';

const BlogSection = () => {
  const posts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Reading Tips",
      title: "How to Read More Books This Year",
      date: "Oct 12, 2023",
      author: "Jane Doe",
      description: "Discover practical strategies to increase your reading volume without sacrificing comprehension or enjoyment."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Author Spotlight",
      title: "An Interview with Best-Selling Author Emma Swift",
      date: "Oct 05, 2023",
      author: "John Smith",
      description: "Get an exclusive look into the creative process and daily routines of one of this year's top authors."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Book Recommendations",
      title: "Top 10 Must-Read Thrillers of the Season",
      date: "Sep 28, 2023",
      author: "Sarah Jones",
      description: "Looking for an edge-of-your-seat experience? Check out our curated list of the most suspenseful new releases."
    }
  ];

  return (
    <section className="py-20 bg-background dark:bg-gray-900 transition-colors" id="blog">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">
              Our Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Articles</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stay updated with the latest literary news, author interviews, reading guides, and book reviews.
            </p>
          </div>
          
          <button className="flex items-center gap-2 font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors group whitespace-nowrap">
            View All Posts 
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/50 transition-all duration-300 group flex flex-col border border-gray-100 dark:border-gray-700"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/90 backdrop-blur text-primary rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h3 className="font-heading font-semibold text-xl text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-primary dark:group-hover:text-primary-light transition-colors line-clamp-2">
                  <a href="#">{post.title}</a>
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <a href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark dark:hover:text-primary-light transition-colors group/link text-sm uppercase tracking-wide">
                    Read More 
                    <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;
