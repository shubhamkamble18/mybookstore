import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutForm from '../components/CheckoutForm';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import backend from '../api/backend';
import toINR from '../utils/currency';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_sample");

const Checkout = () => {
  const { currentUser } = useAuth();
  const { cartItems, totalPrice, quickBuyItem, clearQuickBuy } = useCartContext();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // If a quickBuyItem exists, use ONLY that item. Otherwise use the full cart.
  const checkoutItems = quickBuyItem ? [quickBuyItem] : cartItems;
  const checkoutTotal = checkoutItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("success") === "true") {
      // Clear quickBuyItem after successful payment so the cart stays intact
      clearQuickBuy();
      setIsSuccess(true);
      setLoading(false);
    }
  }, [location.search]);

  const initializationStarted = React.useRef(false);

  useEffect(() => {
    const initializeCheckout = async () => {
      if (initializationStarted.current) return;
      initializationStarted.current = true;

      setLoading(true);
      setError(null);
      try {
        const finalAmount = checkoutTotal + (checkoutTotal * 0.08) + (checkoutTotal > 50 ? 0 : 5.99);
        const orderResponse = await backend.post("/api/orders/", {
          total_amount: finalAmount,
          items: checkoutItems.map(item => {
            const pid = String(item.dbId || item.id || `fallback-${Math.random().toString(36).substr(2, 9)}`);
            return {
              product_id: pid,
              quantity: item.quantity,
              price: item.price
            };
          })
        });

        const orderId = orderResponse.data.id;
        if (!orderId) throw new Error("Failed to create order reference");

        const paymentResponse = await backend.post("/api/payments/create-payment-intent", {
          amount: finalAmount,
          order_id: orderId
        });

        if (paymentResponse.data.clientSecret) {
          setClientSecret(paymentResponse.data.clientSecret);
        } else {
          throw new Error("No client secret returned from backend");
        }
      } catch (err) {
        console.error("Error initializing checkout", err);
        const msg = err.response?.data?.error || err.response?.data?.message || err.message;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (checkoutItems.length > 0) {
      initializeCheckout();
    }
  }, []); // run once on mount — checkoutItems is stable at mount time

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200 dark:shadow-none">
          <Lock className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-4xl font-bold font-heading mb-4">Payment Completed!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">
          Thank you for your purchase. Your order has been successfully placed and is now being processed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-xl shadow-primary/25"
        >
          Return to Bookstore <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-primary hover:underline">Return to Home</Link>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#f59e0b',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <Lock className="w-4 h-4" /> Secure Payment
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form Side */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 order-2 md:order-1">
            <h2 className="text-2xl font-bold font-heading mb-6">Payment Details</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 animate-pulse text-sm">Initializing secure checkout...</p>
              </div>
            ) : clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm clientSecret={clientSecret} checkoutTotal={checkoutTotal} />
              </Elements>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex flex-col gap-2">
                <span className="font-bold underline">Failed to initialize payment:</span>
                <p>{error}</p>
                {(error.includes("401") || error.includes("Authorization")) ? (
                  <p className="text-xs bg-white/50 p-2 rounded mt-2">
                    It looks like you might not be logged in or your session expired. Please sign in again.
                  </p>
                ) : (
                  <p className="text-xs opacity-75 mt-2">
                    Please check your backend connection and Stripe keys. If you are developing locally, ensure the Flask server is running.
                  </p>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-xs font-bold uppercase tracking-wider text-center py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 text-gray-400 rounded-xl text-sm font-medium border border-gray-100 italic">
                Waiting for payment intent...
              </div>
            )}
          </div>

          {/* Summary Side */}
          <div className="order-1 md:order-2">
            <div className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 sticky top-28">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {checkoutItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{item.title} x {item.quantity}</span>
                    <span className="font-bold">{toINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{toINR(checkoutTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping & Tax</span>
                  <span>{toINR((checkoutTotal * 0.08) + (checkoutTotal > 50 ? 0 : 5.99))}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-primary">{toINR(checkoutTotal + (checkoutTotal * 0.08) + (checkoutTotal > 50 ? 0 : 5.99))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
