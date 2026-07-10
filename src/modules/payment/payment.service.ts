import { prisma } from '../../lib/prisma';
import Stripe from 'stripe';
import config from '../../config'; 

const stripe = new Stripe(config.stripe.secret_key as string, {
  apiVersion: '2023-10-16' as any,
});

const createPaymentIntent = async (amount: number) => {
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  return {
    clientSecret: paymentIntent.client_secret,
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
  createPaymentIntent,
  savePayment,
  getMyPayments,
  getPaymentById
};