// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
import express from 'express';
import Stripe from 'stripe';

const app = express();

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51PPfQMP8WnHYzfx7WST3hqTMUaNasCqM8KzEJvyqp7e4fblnhJndYuxz2Az9QkVRePAWkXmmY8W5cf0PaA5g0vdz00PQJ83N0E');

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.redirect(303, session.url);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log(`Listening on port ${3000}!`));





// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});



const handlePaymentIntentSucceeded=(paymentIntent)=>{
    console.log("paymentIntent is ",paymentIntent);
}
const handlePaymentMethodAttached=(paymentMethod)=>{
    console.log("paymentMethod is ",paymentMethod)
}