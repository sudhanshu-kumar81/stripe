// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
const PORT=process.env.PORT
const app = express();

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51PPfQMP8WnHYzfx7WST3hqTMUaNasCqM8KzEJvyqp7e4fblnhJndYuxz2Az9QkVRePAWkXmmY8W5cf0PaA5g0vdz00PQJ83N0E');
 app.get('/data',(req,res)=>{
    res.send({data:"hello ji from backend"})
 })
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log("arrived in create checkout")
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

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));





// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  console.log("arrived in webhhoks")
  console.log("REQ.BODY Is ",request.body)
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucced = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      HandlepaymentIntentSucced(paymentIntentSucced);
      break;
      case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      HandlepaymentIntentFailed(paymentIntentFailed);
      break;
    // ... handle other event types//
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});



const HandlepaymentIntentSucced=(paymentIntentSucced)=>{
    console.log("paymentIntent is ",paymentIntentSucced);
}
const HandlepaymentIntentFailed=(paymentIntentFailed)=>{
    console.log("paymentMethod is ",paymentIntentFailed)
}