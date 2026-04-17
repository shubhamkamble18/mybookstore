import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black pt-20 pb-10 text-white relative overflow-hidden transition-colors" id="contact">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl leading-none">
                M
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                MyBook<span className="text-primary-light">Store</span>
              </span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for all your reading needs. We offer a vast collection of books across various genres to spark your imagination and fuel your curiosity.
            </p>
            
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-gray-700/50">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-gray-700/50">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-gray-700/50">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 shadow-sm border border-gray-700/50">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">About Us</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Products</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Login / Register</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Order History</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">FAQ & Return Policy</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white uppercase tracking-wider">Top Categories</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Action & Adventure</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Science Fiction</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Romance</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Mystery & Thrillers</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Self Development</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors inline-block transform hover:translate-x-1">Children's Books</a></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6 text-white uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter to receive updates on new arrivals, special offers, and literary events.
            </p>
            <form className="relative mb-8" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                required
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary hover:bg-primary-dark flex items-center justify-center text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>123 Bookworm Lane, NY 10012, USA</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-light flex-shrink-0" />
                <span>hello@mybookstore.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <p>&copy; {new Date().getFullYear()} MyBookStore. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-light transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-light transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
