
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
 
const PaymentForm = () => {
 
 /*Initializes the `stripe` object by using the useStripe hook, allowing access to Stripe methods and properties.*/
 
 const stripe = useStripe();
 
  /*Initializes the elements object by using the useElements hook, which provides access to Stripe Elements for building the user interface.*/
 
const elements = useElements();
 
const [paymentError, setPaymentError] = useState(null);
 
const [paymentSuccess, setPaymentSuccess] = useState(false);
 
const handleSubmit = async (event) => {
 
event.preventDefault();
 /* Calls the `stripe.confirmCardPayment` method 
 
 with the `clientSecret` (received from the server) 
 
and the payment method details (in this case, the `CardElement` from Stripe Elements).*/
 const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
payment_method: { card: elements.getElement(CardElement) },
});
 
if (error)  setPaymentError(error.message);
 
else  setPaymentSuccess(true);
 
};
 
return (
 
<form onSubmit={handleSubmit}>
 
<CardElement />
 
<button type="submit"> Pay Now </button>
</form>
 
);
 
};
 
export default PaymentForm;