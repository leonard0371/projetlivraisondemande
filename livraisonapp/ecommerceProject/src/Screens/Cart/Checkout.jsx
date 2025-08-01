// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
 
// const stripePromise = loadStripe(process.env.Stripe_Public_Key);
 
// function CheckoutForm() {
//   const stripe = useStripe();
//   const elements = useElements();
 
//   const handleSubmit = async (event) => {
//     event.preventDefault();
 
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: elements.getElement(CardElement),
//     });
 
//     if (!error) {
// // Send paymentMethod.id to your server
//     }
//   };
 
//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit">Pay</button>
//     </form>
//   );
// }
 
// const Checkout=()=> {
//   return (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm />
//     </Elements>
//   );
// }
// export default Checkout;
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
 
import PaymentForm from './PaymentForm';
 
const stripePromise = loadStripe("pk_test_51PU61CP01WS8hQJviDSikHejg3Iibouwu0XkuinrSQQbvBxpoemQ5i3MG3lkacgghl4l7GLlxdnuSbAlkqIr9J6200DBnb5AxR");
 
const Checkout = () => {
 
return (
 
<Elements stripe={stripePromise}>
 
<PaymentForm />
 
</Elements>
 
);
 
};
 
   export default Checkout;