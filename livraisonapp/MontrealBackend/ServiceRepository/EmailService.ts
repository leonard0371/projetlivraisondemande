import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateEmailTemplate } from './EmailTemplate';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string,companyName: string, text: string) => {
  const htmlContent = generateEmailTemplate(companyName, text);

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent:', info.response);
  } catch (error) {
    // console.error('Error sending email:', error);
    // console.log(process.env.EMAIL_USER,'from email')
  }
};

export const sendOnboardingEmail = async (
  to: string,
  onboardingLink: string,
  details: {
    amount: number; // en centimes
    email: string;  // email du vendeur
    items: string[]; // liste d’articles
    qty: number;
    price: number;
  }
) => {
  const itemsList = details.items
    .map((item) => `<li>${item}</li>`)
    .join('');

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"Marketplace" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Confirmation de paiement & onboarding Stripe',
    html: `
      <h2>Bonjour,</h2>
      <p>Un paiement vous a été attribué en tant que vendeur. Veuillez finaliser votre compte Stripe :</p>
      <p><a href="${onboardingLink}" target="_blank"> Complétez l'onboarding Stripe ici</a></p>

      <hr>
      <h3>Détails du paiement :</h3>
      <p><strong>Email Vendeur:</strong> ${details.email}</p>
      <p><strong>Montant:</strong> $${(details.amount / 100).toFixed(2)}</p>

      <h4>Articles vendus :</h4>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>Quantité totale:</strong> ${details.qty}</p>
      <p><strong>Prix unitaire:</strong> $${details.price.toFixed(2)}</p>

      <hr>
      <p>Merci de faire partie de notre marketplace !</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Onboarding email sent:', info.response);
  } catch (error) {
    console.error('Error sending onboarding email:', error);
  }
};

export const sendPaymentSuccessEmail = async (
  to: string,
  subject: string,
  message: string
) => {
  const html = `
    <h2>${subject}</h2>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Marketplace" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Payment success email sent:', info.response);
  } catch (error) {
    console.error('Error sending payment success email:', error);
  }
};


//  Notification d’un paiement à venir
export const sendVendorPaymentNotificationEmail = async (
  to: string,
  totalAmount: number,
  itemCount: number
) => {
  const html = `
    <h2>Bonjour,</h2>
    <p>Vous avez ${itemCount} article(s) vendu(s) pour un total de <strong>$${(totalAmount / 100).toFixed(2)}</strong>.</p>
    <p>Votre paiement est en cours de traitement.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Marketplace" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Paiement en cours',
      html,
    });
    console.log('Vendor payment notification sent:', info.response);
  } catch (error) {
    console.error('Error sending vendor notification email:', error);
  }
};

// Rapport à un admin (optionnel)
export const sendAdminReportEmail = async (to: string, reportContent: string) => {
  const html = `
    <h2>Rapport du système</h2>
    <p>${reportContent}</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Marketplace Bot" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Rapport journalier de la plateforme',
      html,
    });
    console.log('Admin report sent:', info.response);
  } catch (error) {
    console.error('Error sending admin report email:', error);
  }
};