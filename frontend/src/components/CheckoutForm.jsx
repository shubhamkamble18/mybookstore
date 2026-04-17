import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const CheckoutForm = ({ clientSecret, checkoutTotal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, clearQuickBuy } = useCartContext();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('error'); // 'error' | 'info' | 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [elementsReady, setElementsReady] = useState(false);

  // Check for a returned payment intent status after redirect (e.g. 3D Secure)
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      switch (paymentIntent.status) {
        case 'succeeded':
          handlePaymentSuccess();
          break;
        case 'processing':
          showMessage('Your payment is being processed. We\'ll update you when it\'s complete.', 'info');
          break;
        case 'requires_payment_method':
          // Normal state — user needs to enter card details
          break;
        default:
          break;
      }
    });
  }, [stripe, clientSecret]);

  const handlePaymentSuccess = () => {
    clearQuickBuy();
    clearCart();
    navigate('/checkout?success=true', { replace: true });
  };

  const showMessage = (msg, type = 'error') => {
    setMessageType(type);
    setMessage(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !elementsReady) {
      showMessage('Payment form is not ready yet. Please wait a moment and try again.', 'info');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // No need to manually submit elements – stripe.confirmPayment will handle validation
      // const { error: submitError } = await elements.submit();
      // if (submitError) {
      //   showMessage(submitError.message || 'Please check your card details and try again.');
      //   setIsLoading(false);
      //   return;
      // }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?success=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Card errors and validation errors shown to the user
        if (error.type === 'card_error' || error.type === 'validation_error') {
          showMessage(error.message);
        } else if (error.code === 'payment_intent_authentication_failure') {
          showMessage('Authentication failed. Please try a different payment method.');
        } else {
          showMessage(`Payment failed: ${error.message || 'An unexpected error occurred. Please try again.'}`);
        }
        setIsLoading(false);
        return;
      }

      // Handle all paymentIntent statuses
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            handlePaymentSuccess();
            break;
          case 'processing':
            showMessage('Your payment is processing. You\'ll receive a confirmation shortly.', 'info');
            setIsLoading(false);
            break;
          case 'requires_action':
            // Stripe will handle the redirect automatically for 3D Secure etc.
            showMessage('Additional authentication required. Please complete the verification.', 'info');
            setIsLoading(false);
            break;
          case 'requires_payment_method':
            showMessage('Your payment was not completed. Please try a different payment method.');
            setIsLoading(false);
            break;
          default:
            showMessage(`Payment status: ${paymentIntent.status}. Please contact support if this persists.`, 'info');
            setIsLoading(false);
        }
      } else {
        // No error AND no paymentIntent — likely redirecting for 3DS
        // Do nothing; Stripe will redirect and come back via return_url
      }
    } catch (err) {
      console.error('Unexpected payment error:', err);
      showMessage('An unexpected error occurred. Please refresh the page and try again.');
      setIsLoading(false);
    }
  };

  const finalTotal = checkoutTotal
    ? Math.round(checkoutTotal + (checkoutTotal * 0.08) + (checkoutTotal > 50 ? 0 : 5.99))
    : 0;

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        id="payment-element"
        options={{ layout: 'tabs' }}
        onReady={() => setElementsReady(true)}
      />

      {message && (
        <div
          id="payment-message"
          className={`p-3 rounded-lg text-sm border flex items-start gap-2 ${
            messageType === 'error'
              ? 'bg-red-50 text-red-600 border-red-100'
              : messageType === 'success'
              ? 'bg-green-50 text-green-600 border-green-100'
              : 'bg-blue-50 text-blue-600 border-blue-100'
          }`}
        >
          {messageType === 'error' ? (
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : messageType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 mt-0.5 flex-shrink-0 animate-spin" />
          )}
          <span>{message}</span>
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements || !elementsReady}
        id="submit"
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing payment...
          </>
        ) : !elementsReady ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </>
        ) : (
          `Pay ₹${finalTotal.toLocaleString('en-IN')}`
        )}
      </button>

      <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
        Payments are safe and encrypted by Stripe. By purchasing, you agree to our Terms of Service.
      </p>

      {/* Test card hint for development */}
      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">🧪 Test Card (Stripe Test Mode)</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">4242 4242 4242 4242 · Any future date · Any CVC</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This standard test card simulates a successful payment.</p>
      </div>
    </form>
  );
};

export default CheckoutForm;
