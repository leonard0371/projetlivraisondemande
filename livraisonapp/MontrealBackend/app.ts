import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import Stripe from 'stripe';

import setupSwagger from './swagger';
import { userRouter } from './routes/userRoutes';
import { productRouter } from './routes/productRoutes';
import { vendorRouter } from './routes/vendorRoutes';
import { paymentRouter } from './routes/paymentRoutes';
import { contactRouter } from './routes/contactRoutes';
import { categoryRouter } from './routes/categoryRoutes';
import { checkoutRouter } from './routes/checkoutRoutes';
import stripeRouter from './routes/Stripe';
import authRouter from './routes/AuthRoutes';
import { cartRouter } from './routes/cartRoutes';
import { soldRouter } from './routes/soldproductRoutes';
import { deliveryRouter } from './routes/deliveryRoutes';
import { vendorModel } from './models/Ivendor';
import { VendorPaymentModel } from './models/vendorPayment';
import { sendOnboardingEmail, sendPaymentSuccessEmail } from './ServiceRepository/EmailService';


dotenv.config();

console.log(" MONGODB:", process.env.MONGODB_CONNECTION_STRING);
console.log(" STRIPE SECRET:", process.env.Stripe_Secret_Key);
console.log(" HOME URL:", process.env.HOME_URL);
console.log("APP DIR:", __dirname);
console.log(" DOTENV OK:", process.env.DOTENV);


const app = express();
const PORT = process.env.PORT || 3001;

const stripe = new Stripe(process.env.Stripe_Secret_Key as string, {});

const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

// Middlewares
setupSwagger(app);

const MARKETPLACE_FEE_PERCENTAGE = 0.051;  // 5.1%
const STRIPE_PERCENTAGE = 0.029; // 2.9%
const STRIPE_FIXED_FEE = 0.30;

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
  } catch (err) {
    if (err instanceof Error) {
      console.error(' Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    } else {
      console.error('Webhook signature unknown error:', err);
      return res.status(400).send(`Webhook Error: Unknown error`);
    }
  }

  if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;

    if (account.capabilities?.transfers === 'active') {
      try {
        const vendor = await vendorModel.findOne({ stripeAccountId: account.id });
        if (!vendor) return res.status(404).send('Vendeur non trouvé');

        vendor.stripeOnboarded = true;
        await vendor.save();

        const pendingPayments = await VendorPaymentModel.find({
          vendorId: vendor._id,
          status: 'pending',
        });

        for (const vendorPayment of pendingPayments) {
          try {
            console.log(' Montant à transférer (webhook)', vendorPayment.amount);

            const amountInCents = Math.round(parseFloat(vendorPayment.amount.toString()) * 100);
            const marketplaceFee = Math.round(amountInCents * MARKETPLACE_FEE_PERCENTAGE);
            const vendorAmountBeforeStripe = amountInCents - marketplaceFee;
            const stripeFee = Math.round(vendorAmountBeforeStripe * STRIPE_PERCENTAGE + STRIPE_FIXED_FEE * 100);
            const vendorPayout = vendorAmountBeforeStripe - stripeFee;

            if (!vendor.stripeAccountId) {
              console.error('Le vendeur n\'a pas de stripeAccountId défini');
              vendorPayment.status = 'unpaid';
              await vendorPayment.save();
              continue;
            }

            console.log(' Tentative de transfert Stripe (webhook) :', {
              vendorPayout,
              amountInCents,
              stripeFee,
              marketplaceFee,
              destination: vendor.stripeAccountId,
              vendorId: vendor._id.toString(),
              orderId: vendorPayment.orderId.toString(),
            });

            const transfer = await stripe.transfers.create({
              amount: vendorPayout,
              currency: 'cad',
              destination: vendor.stripeAccountId,
              metadata: {
                orderId: vendorPayment.orderId.toString(),
                vendorId: vendor._id.toString(),
              },
            });

            vendorPayment.status = 'paid';
            await vendorPayment.save();

            await sendPaymentSuccessEmail(
              vendor.email,
              'Paiement reçu après onboarding',
              `Bonjour,\n\nLe paiement de votre commande ${vendorPayment.orderId} a été traité avec succès. Montant transféré : ${(vendorPayout / 100).toFixed(2)} CAD.`
            );

          } catch (transferError) {
            console.error(`Erreur de transfert Stripe pour commande ${vendorPayment.orderId}:`, transferError);

            vendorPayment.status = 'unpaid';
            await vendorPayment.save();
          }
        }
      } catch (error) {
        console.error('Erreur pendant le traitement de l\'onboarding :', error);
        return res.status(500).send('Erreur traitement onboarding');
      }
    }
  } else if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // This is where you would typically fulfill the order.
    // For now, we will create a delivery request.

    try {
      // Note: You might need to retrieve the line items to get product/vendor info
      // This is a simplified example.
      const vendorId = session.metadata?.vendorId; // Assuming you pass this in metadata
      const vendor = await vendorModel.findById(vendorId);

      if (!vendor) {
        console.error(`Vendor not found for ID: ${vendorId}`);
        return res.status(404).send('Vendor not found for order.');
      }

      const shippingDetails = session.shipping_details;
      const customerDetails = session.customer_details;

      if (!shippingDetails || !shippingDetails.address) {
        console.error('Shipping address not available in checkout session.');
        // Maybe handle non-shippable orders here
        return res.status(400).send('Shipping address is required for delivery.');
      }
      
      // Comment out or remove the block that creates a new DeliveryModel instance
      // const newDelivery = new DeliveryModel({
      //   vendorId: vendor._id,
      //   pickupAddress: vendor.BusinessAddress, // Using vendor's business address
      //   deliveryAddress: `${shippingDetails.address.line1}, ${shippingDetails.address.city}, ${shippingDetails.address.state} ${shippingDetails.address.postal_code}`,
      //   clientName: customerDetails.name,
      //   clientPhoneNumber: customerDetails.phone || 'N/A',
      //   packageDetails: `Order from checkout session ${session.id}`,
      //   status: 'pending'
      // });

      // await newDelivery.save();
      // console.log(`Delivery request created automatically for order ${session.id}`);

    } catch (error) {
      console.error('Failed to create automatic delivery request:', error);
      // Decide if this should return an error response
    }
  }

  res.status(200).json({ received: true });
});

app.use(cors({
  origin: [
    'https://montrealhaven.com',
    'https://www.montrealhaven.com',
    'http://localhost:5173',
    'http://localhost:443'
  ],
  credentials: true,
}));

app.use(bodyParser.json());

// Routes
app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', vendorRouter);
app.use('/', paymentRouter);
app.use('/', contactRouter);
app.use('/', categoryRouter);
app.use('/', authRouter);
app.use('/', cartRouter);
app.use('/', soldRouter);
app.use('/', deliveryRouter);
app.use('/', checkoutRouter);
app.use('/api/stripe', stripeRouter);


// Endpoint de vérification de la maintenance
app.get('/api/maintenance', (req, res) => {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  console.log('isMaintenance', isMaintenance)

  const isDev = req.query.dev === 'true';

  if (isMaintenance && !isDev) {
    return res.json({ maintenance: true });
  }

  return res.json({ maintenance: false });
});

const server = createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.sessionId) {
                clients.set(data.sessionId, ws);
                console.log(`Client connecté avec sessionId : ${data.sessionId}`);
            }
        } catch (err) {
            console.error('Message WebSocket invalide', err);
        }
    });

    ws.on('close', () => {
        for (const [key, value] of clients.entries()) {
            if (value === ws) {
                clients.delete(key);
                console.log(` Client déconnecté : ${key}`);
            }
        }
    });
});

export const notifyClient = (sessionId: string, payload: any) => {
    const client = clients.get(sessionId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
    }
};

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
