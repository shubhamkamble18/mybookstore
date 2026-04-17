import { Instagram } from 'lucide-react';

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  ];

  return (
    <section className="py-20 bg-white" id="gallery">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Follow Us On <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Instagram</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto flex items-center justify-center gap-2">
            <Instagram className="w-5 h-5 text-pink-500" />
            <span>@mybookstore_official</span>
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Instagram post ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <Instagram className="w-8 h-8 text-white scale-50 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Gallery;
