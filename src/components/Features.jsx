import { Truck, CheckCircle, Tag, ShieldCheck } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders over $50',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: CheckCircle,
      title: 'Quality Guarantee',
      description: '100% genuine products',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Tag,
      title: 'Daily Offers',
      description: 'Discounts up to 30%',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      description: '100% secure checkout',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 group"
              >
                <div className={`p-4 rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-gray-900 text-lg mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
