import React, { useState } from 'react';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { useCartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCartContext();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate network latency / Stripe API validation
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutSuccess(true);
      clearCart(); // Empty the cart upon "success"
    }, 2500);
  };

  if (checkoutSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-inner">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center font-heading">Payment Successful!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md text-center text-lg leading-relaxed">
          Thank you for your order! This was a simulated checkout flow. Your digital books are safe with us.
        </p>
        <Link 
          to="/" 
          onClick={() => setCheckoutSuccess(false)}
          className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-xl shadow-primary/25 hover:-translate-y-1 active:translate-y-0"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-white mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
          Looks like you haven't added any books yet. Discover your next favorite read in our collection!
        </p>
        <Link 
          to="/" 
          className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold transition-all shadow-sm hover:-translate-y-1"
        >
          Start Browsing
        </Link>
      </div>
    );
  }

  const tax = totalPrice * 0.08;
  const delivery = totalPrice > 50 ? 0 : 5.99; // Free shipping over $50
  const finalTotal = totalPrice + tax + delivery;

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 min-h-screen py-12 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 dark:text-white mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
           Shopping Cart <span className="text-gray-400 dark:text-gray-500 text-2xl font-normal ml-2">({cartItems.length} items)</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start transition-all hover:shadow-md"
              >
                {/* Image */}
                <div className="w-24 h-36 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden relative border border-gray-200 dark:border-gray-700">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-center text-gray-400 p-2 font-medium">
                      No Image
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col text-center sm:text-left h-full justify-between w-full">
                  <div>
                    <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-white line-clamp-2">{item.title}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{item.author}</p>
                  </div>
                  
                  <div className="font-bold text-gray-900 dark:text-white text-xl mt-4">
                    ${Number(item.price).toFixed(2)}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto h-full gap-4 sm:gap-0">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-700 p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-colors flex items-center gap-1.5 sm:mt-auto text-sm font-bold"
                  >
                    <Trash2 className="w-4 h-4" /> 
                    <span className="sm:hidden">Remove</span>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 px-2">
              <Link to="/" className="text-primary hover:text-primary-dark font-semibold text-sm transition-colors flex items-center gap-1">
                 <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="text-gray-400 hover:text-red-500 font-bold text-sm transition-colors py-2"
              >
                Empty Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8 sticky top-28">
              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                 Order Summary
              </h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Estimated Tax</span>
                  <span className="font-bold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Shipping & Handling</span>
                  <span className={`font-bold ${delivery === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                    {delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}
                  </span>
                </div>
              </div>
                
              <div className="flex justify-between items-center text-xl font-bold font-heading text-gray-900 dark:text-white mb-8">
                <span>Total</span>
                <span className="text-primary dark:text-primary-light">${finalTotal.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 ${isProcessing ? 'opacity-80 cursor-wait' : 'hover:-translate-y-1'}`}
              >
                {isProcessing ? (
                   <><Loader2 className="w-5 h-5 animate-spin" /> Authorizing Payment...</>
                ) : (
                   <><CreditCard className="w-5 h-5" /> Secure Checkout <ArrowRight className="w-5 h-5 ml-1" /></>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale select-none">
                 {/* Mock payment logos */}
                 <div className="font-bold italic text-blue-800 dark:text-gray-300">VISA</div>
                 <div className="font-bold italic text-orange-600 dark:text-gray-300">MasterCard</div>
                 <div className="font-bold text-gray-800 dark:text-gray-300">Stripe</div>
              </div>

              <p className="text-xs text-center text-gray-400 font-medium mt-6">
                Guaranteed safe & secure simulated checkout process.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Helper icon not originally imported globally in the file above
const ArrowLeft = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
)

export default CartPage;
