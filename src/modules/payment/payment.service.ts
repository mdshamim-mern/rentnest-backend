import { prisma } from '../../lib/prisma';
import Stripe from 'stripe';
import config from '../../config'; 

const stripeKey = config.stripe?.secret_key || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2023-10-16' as any,
});

const createPaymentSession = async (amount: number, frontendUrl: string = 'http://localhost:3000') => {
  const amountInCents = Math.round(amount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'RentNest Property Rent',
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${frontendUrl}/dashboard/tenant/payments`,
    cancel_url: `${frontendUrl}/dashboard/tenant/requests`,
  });

  return {
    url: session.url,
  };
};

const savePayment = async (payload: any) => {
  const { rentalRequestId, amount, transactionId, status } = payload;

  const result = await prisma.payment.create({
    data: {
      rentalRequest: {
        connect: {
          id: rentalRequestId 
        }
      },
      amount: Number(amount),
      transactionId: transactionId,
      status: status || 'PAID', 
    },
  });
  
  await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId as string
    },
    data: {
      status: 'ACTIVE' as any 
    }
  });

  return result;
};

const getMyPayments = async (tenantId: string) => {
  return await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: tenantId
      }
    },
    include: {
      rentalRequest: {
        include: {
          property: true
        }
      }
    }
  });
};

const getPaymentById = async (paymentId: string, tenantId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: true
        }
      }
    }
  });

  if (!payment || payment.rentalRequest.tenantId !== tenantId) {
    throw new Error("Payment not found or unauthorized!");
  }

  return payment;
};

export const PaymentService = {
  createPaymentSession,
  savePayment,
  getMyPayments,
  getPaymentById
};