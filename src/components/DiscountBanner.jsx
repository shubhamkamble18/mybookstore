import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const DiscountBanner = () => {
  // Simple countdown logic for visual effect (3 days, 14 hours, 45 mins, 20 secs)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 45,
    seconds: 20
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with soft gradient overlay */}
      <div className="absolute inset-0 bg-primary-dark">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-accent/90"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/20 text-white font-medium text-sm tracking-wide border border-white/30 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Limited Time Offer
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-md">
              Get <span className="text-yellow-300">30% Off</span> on All<br className="hidden md:block"/> Best Sellers
            </h2>
            
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Update your reading list with our most popular titles. 
              Don't miss out on this exclusive seasonal discount.
            </p>

            <button className="inline-flex items-center gap-2 bg-white text-primary-dark hover:bg-gray-50 hover:text-primary font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1">
              Claim Discount Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-white/90 font-medium mb-6 text-lg uppercase tracking-wider">Offer ends in:</p>
            <div className="flex gap-4 sm:gap-6">
              {timeBlocks.map((block, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-3 border-2 border-white/50 backdrop-blur-sm">
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-primary-dark">
                      {block.value.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-white/90 text-sm font-medium uppercase tracking-wider">{block.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default DiscountBanner;
