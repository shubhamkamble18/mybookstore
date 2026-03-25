import { BookOpen, Briefcase, HeartPulse, Laptop, GraduationCap } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      name: 'Fiction',
      icon: BookOpen,
      count: '1,245 Books',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      name: 'Business',
      icon: Briefcase,
      count: '840 Books',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      name: 'Self Development',
      icon: HeartPulse,
      count: '950 Books',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
    {
      name: 'Technology',
      icon: Laptop,
      count: '1,120 Books',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-500',
    },
    {
      name: 'Education',
      icon: GraduationCap,
      count: '640 Books',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 transition-colors" id="categories">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Categories</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our extensive collection of books across various genres and disciplines. 
            There's something for everyone.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <a 
                key={index}
                href="#"
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 ${category.bgColor} dark:bg-opacity-10 dark:bg-gray-800`}>
                  <Icon className={`w-8 h-8 ${category.iconColor} dark:text-opacity-80`} />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors text-center text-lg mb-1">
                  {category.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{category.count}</span>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Categories;
