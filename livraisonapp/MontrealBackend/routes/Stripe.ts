
import express, { Request, Response, Router } from 'express';
import Stripe from 'stripe';
import { ProductModel } from '../models/Iproducts';
import { OrderModel } from '../models/Order';
import { VendorPaymentModel } from '../models/vendorPayment';
import { vendorModel } from '../models/Ivendor';
import { ClientSession } from 'mongodb'; // Importer ClientSession
import { error } from 'console';
import mongoose from "mongoose";
import { Types } from 'mongoose';
import { sendOnboardingEmail, sendPaymentSuccessEmail } from '../ServiceRepository/EmailService';
const app = express();

require('dotenv').config();

const stripeRouter: Router = express.Router();
const router = express.Router();
const HOME_URL = process.env.HOME_URL;
const stripe = new Stripe(process.env.Stripe_Secret_Key as string, {});
  // $0.30 fixed fee



type VendorItem = {
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
};

type VendorGroup = {
  vendorId: string;
  items: VendorItem[];
  total: number;
};



export async function processTestPayment(amount: number, vendorStripeAccount: string) {
    try {
        // Step 1: Calculate marketplace commission
        const marketplaceFee = Math.round(amount * MARKETPLACE_FEE_PERCENTAGE); 

        // Step 2: Vendor's earnings before Stripe fee
        const vendorAmountBeforeStripe = amount - marketplaceFee;

        // Step 3: Stripe’s 2.9% + 0.30 fee on vendor's share
        const stripeFee = Math.round(vendorAmountBeforeStripe * STRIPE_PERCENTAGE + STRIPE_FIXED_FEE * 100);

        // Step 4: Vendor’s final payout after Stripe fees
        const vendorPayout = vendorAmountBeforeStripe - stripeFee;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Total à facturer
          currency: 'cad',
          confirm: true,
          application_fee_amount: marketplaceFee, // La commission du marketplace
          transfer_data: {
              destination: vendorStripeAccount, // Envoyer les paiements au compte du vendeur
              amount: vendorPayout, // Montant que le vendeur reçoit après les frais de Stripe
          },
          automatic_payment_methods: {
              enabled: true, // Activer les paiements automatiques
          },
      });
      
      

        console.log('Test Payment Successful:', paymentIntent);
        return { success: true, paymentIntent };
    } catch (error) {
        console.error('Test Payment Failed:', error);
        return { success: false, error };
    }
}

stripeRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
  const session: ClientSession = await ProductModel.startSession(); // Définir le type explicite ici
  session.startTransaction();

  try {
    const { productItems } = req.body;

    // console.log("Produits reçus :", productItems);

    // Vérification du stock avant de créer la session Stripe
    for (const item of productItems) {
      // console.log('Item:', item);
      const product = await ProductModel.findOne({ _id: item.productId }).session(session);

      // Vérifier si le produit existe
      if (!product) {
        // return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
        throw new Error(`Produit introuvable : ID ${item.productId}`);
      }

      // Vérification de la quantité en stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.quantity}, requested: ${item.quantity}`
        });
      }
    }

    // Création des items pour Stripe
    const lineItems = productItems.map((item: any) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          images: item.images,
          metadata: {
            productId: item._id, 
            vendorId: item.vendorId 
          }
        },
        unit_amount: Math.round(Number(item.price) * 100),
      
      },
      quantity: item.quantity,
    }));

    // console.log('line items', lineItems)


    // Création de la session de paiement Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${HOME_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${HOME_URL}`,
      shipping_address_collection: {
        allowed_countries: ['CA'], // Add allowed countries here
      },    


      //Enable Phone number collection
      // phone_number_collection: {
      //   enabled: true,
      // },

      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // Shipping fee in cents (e.g., $8.00)
              currency: 'cad',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1000, // Expedited shipping fee (e.g., $15.00)
              currency: 'cad',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
            },
          },
        },
      ],
      consent_collection: {
        terms_of_service: 'required' // This makes terms of service acceptance mandatory
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: "Refund Policy:\nCustomers who place an order from outside our service area (Greater Montreal) will be eligible for a refund. Transaction fees incurred during the payment process are non-refundable and will be deducted from the total refund amount."
        }
      }

    });

    // Commit de la transaction MongoDB
    await session.commitTransaction();
    // console.log("Transaction MongoDB validée.");


    // Retourner l'URL de la session de paiement
    res.json({
      url: stripeSession.url,
      items: productItems.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subTotal: item.subTotal,
      })),
    });
  

  } catch (error) {
    await session.abortTransaction();
    console.error("Erreur lors de la création de session Stripe :", error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  } finally {
    session.endSession();
  }
});

stripeRouter.get('/success', async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID manquant." });
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ['data.price.product'],
  });

  const customerEmail = stripeSession.customer_details?.email;
  const customerAddress = stripeSession.customer_details?.address;

  const dbSession = await ProductModel.startSession();
  dbSession.startTransaction();

  try {
    if (stripeSession.payment_status === 'paid') {
      for (const item of lineItems.data) {
        if (!item.quantity) continue;

        const product = item.price?.product as Stripe.Product;

        await ProductModel.findOneAndUpdate(
          { name: item.description },
          { $inc: { quantity: -item.quantity } },
          { session: dbSession }
        );
      }
    }

    const orderDetails = {
      customer_email: customerEmail,
      customer_address: customerAddress,
      session_id: sessionId,
      currency: stripeSession.currency,
      items: lineItems.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        const price = item.amount_total / 100;
        return {
          name: item.description,
          price: mongoose.Types.Decimal128.fromString(price.toFixed(2)),
          quantity: item.quantity,
          subTotal: mongoose.Types.Decimal128.fromString(price.toFixed(2)),
          vendorId: new mongoose.Types.ObjectId(product.metadata.vendorId),
        };
      }),
      total_amount: mongoose.Types.Decimal128.fromString(
        (lineItems.data.reduce((acc, item) => acc + item.amount_total, 0) / 100).toFixed(2)
      ),
    };

    const newOrder = new OrderModel(orderDetails);
    await newOrder.save({ session: dbSession });

    const orderId = newOrder._id;
    const vendorsGrouped = groupItemsByVendor(orderDetails.items);

    for (const [vendorId, items] of Object.entries(vendorsGrouped)) {
      const amount = items.reduce((sum, item) => sum + parseFloat(item.subTotal.toString()), 0);

       // Conversion finale en Decimal128
     const amountDecimal = mongoose.Types.Decimal128.fromString(amount.toFixed(2));
      await VendorPaymentModel.create({
        orderId,
        vendorId,
        amount: amountDecimal,
        status: "unpaid",
        items,
      });
    }

    await dbSession.commitTransaction();
    res.redirect(`${process.env.FRONTEND_URL}/Products?success=true&orderId=${newOrder._id}`);
  } catch (err) {
    if (dbSession.inTransaction()) await dbSession.abortTransaction();
    res.status(500).json({ error: "Erreur de traitement du paiement." });
  } finally {
    dbSession.endSession();
  }
});



// Fonction pour grouper les articles par vendeur
const groupItemsByVendor = (items: any[]): Record<string, any[]> => {
  return items.reduce((groups, item) => {
    const vendorId = item.vendorId.toString();
    if (!groups[vendorId]) groups[vendorId] = [];
    groups[vendorId].push(item);
    return groups;
  }, {} as Record<string, any[]>);
};





  export const getOrderGroupedByVendors = async (orderId: any): Promise<Record<string, any[]>> => {
  
    let objectId: Types.ObjectId;
  
    try {
      objectId = typeof orderId === 'string'
        ? new mongoose.Types.ObjectId(orderId)
        : orderId;
    } catch (err) {
      console.error("ID invalide :", err);
      throw new Error("ID de commande invalide");
    }
  
    const order = await OrderModel.findById(objectId);
    if (!order) {
      console.error("Commande introuvable avec l'orderId:", objectId);
      throw new Error("Commande introuvable");
    }
  
    const groupedByVendor = groupItemsByVendor(order.items);
    return groupedByVendor;
  };
  




stripeRouter.get("/orders/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;
  // console.log('session Id', sessionId);

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID manquant." });
  }

  try {
    // const order = await OrderModel.findOne({ session_id: sessionId });
    const order = await OrderModel.findOne({ _id: new mongoose.Types.ObjectId(sessionId) });
    

    // console.log('order', order)

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée." });
    }

    res.json(order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

const MARKETPLACE_FEE_PERCENTAGE = 0.051;  // 5.1%
const STRIPE_PERCENTAGE = 0.029; // 2.9%
const STRIPE_FIXED_FEE = 0.30;

stripeRouter.post('/pay-vendor', async (req: Request, res: Response) => {
  const { orderId, vendorId }: { orderId: string; vendorId: string } = req.body;

  if (!orderId || !vendorId) {
    return res.status(400).json({ error: 'orderId et vendorId requis.' });
  }

  try {
    const vendorPayment = await VendorPaymentModel.findOne({ orderId, vendorId });
    if (!vendorPayment) {
      return res.status(404).json({ error: 'Paiement introuvable' });
    }

    if (vendorPayment.status === 'paid') {
      return res.status(400).json({ error: 'Ce paiement a déjà été effectué.' });
    }

    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendeur introuvable.' });
    }

    //  Créer un compte Stripe si inexistant
    if (!vendor.stripeAccountId) {
      try {
        const newAccount = await stripe.accounts.create({
          type: 'express',
          country: 'CA',
          email: vendor.email,
          capabilities: { transfers: { requested: true } },
          business_type: 'individual',
        });

        vendor.stripeAccountId = newAccount.id;
        vendor.stripeOnboarded = false;
        await vendor.save();

        vendorPayment.status = 'pending';
        await vendorPayment.save();

        const onboardingLink = await createAccountLink(newAccount.id);

        await sendOnboardingEmail(vendor.email, onboardingLink, getVendorEmailDetails(vendorPayment, vendor.email));

        return res.status(202).json({
          message: 'Compte Stripe créé. Onboarding requis, Email bien envoyé au vendeur',
          onboardingLink,
        });
      } catch (err: any) {
        console.error('Erreur création compte Stripe:', err);
        return res.status(500).json({ error: 'Erreur création compte Stripe.', details: err.message });
      }
    }

    //  Vérifier si l’onboarding est terminé
    const account = await stripe.accounts.retrieve(vendor.stripeAccountId);
    if (account.capabilities?.transfers !== 'active') {
      const onboardingLink = await createAccountLink(vendor.stripeAccountId);

      vendor.stripeOnboarded = false;
      await vendor.save();

      vendorPayment.status = 'pending';
      await vendorPayment.save();

      await sendOnboardingEmail(vendor.email, onboardingLink, getVendorEmailDetails(vendorPayment, vendor.email));

      return res.status(202).json({
        message: 'Onboarding Stripe requis, Email Envoyé Au Vendor',
        onboardingLink,
        capabilities: account.capabilities,
      });
    }

    console.log('Montant à transférer (pay-vendor)', vendorPayment.amount);


    //  Calcul des montants
    const amountInCents = Math.round(parseFloat(vendorPayment.amount.toString()) * 100);
    const marketplaceFee = Math.round(amountInCents * MARKETPLACE_FEE_PERCENTAGE);
    const vendorAmountBeforeStripe = amountInCents - marketplaceFee;
    const stripeFee = Math.round(vendorAmountBeforeStripe * STRIPE_PERCENTAGE + STRIPE_FIXED_FEE * 100);
    const vendorPayout = vendorAmountBeforeStripe - stripeFee;


    console.log('Tentative de transfert Stripe (Pay-vendor) :', {
      vendorPayout,
      amountInCents,
      stripeFee,
      marketplaceFee,
      destination: vendor.stripeAccountId,
      vendorId: vendor._id.toString(),
      orderId: vendorPayment.orderId.toString(),
    });

    //  Transfert Stripe
    const transfer = await stripe.transfers.create({
      amount: vendorPayout,
      currency: 'cad',
      destination: vendor.stripeAccountId,
      metadata: {
        orderId,
        vendorId,
      },
    });

    vendorPayment.status = 'paid';
    await vendorPayment.save();

    await sendPaymentSuccessEmail(
      vendor.email,
      'Paiement reçu',
      `Bonjour,\n\nLe paiement de votre commande ${orderId} a été traité avec succès. Montant transféré : ${(vendorPayout / 100).toFixed(2)} CAD.`
    );

    // return res.status(200).json({ success: true, transferId: transfer.id });
    return res.status(200).json({ 
      success: true, 
      transferId: transfer.id,
      message: `Paiement de ${(vendorPayout / 100).toFixed(2)} CAD effectué avec succès.`
    });
    

  } catch (err: any) {
    console.error('Erreur /pay-vendor:', err);
    return res.status(500).json({
      error: 'Erreur serveur durant le paiement.',
      details: err?.message || 'Erreur inconnue',
    });
  }
});

// Génère un lien d'onboarding pour le compte Stripe
async function createAccountLink(accountId: string): Promise<string> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    // refresh_url: 'http://localhost:3000/onboarding-failed',
    refresh_url:'https://montrealhaven.com/onboarding-failed',
    // return_url: 'http://localhost:3000/onboarding-success',
     return_url: 'https://montrealhaven.com/onboarding-success',
    type: 'account_onboarding',
  });

  return accountLink.url;
}

function getVendorEmailDetails(vendorPayment: any, email: string) {
  const items = vendorPayment.items || [];
  return {
    amount: Math.round(parseFloat(vendorPayment.amount.toString()) * 100),
    email,
    items: items.map((i: any) => i.name),
    qty: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
    price: parseFloat(items[0]?.price?.toString() || '0'),
  };
}


export default stripeRouter;
