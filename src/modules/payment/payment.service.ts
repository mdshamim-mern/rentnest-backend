import { prisma } from '../../lib/prisma';
import Stripe from 'stripe';
import config from '../../config'; 

const stripeKey = config.stripe?.secret_key || process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeKey as string, {
  apiVersion: '2023-10-16' as any,
});

const createPaymentSession = async (amount: number, serviceCharge: number = 0, frontendUrl: string = 'http://localhost:3000') => {
  const amountInCents = Math.round(amount * 100);
  const serviceChargeInCents = Math.round(serviceCharge * 100);

  const line_items: any[] = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'RentNest Property Rent',
        },
        unit_amount: amountInCents,
      },
      quantity: 1,
    }
  ];

  if (serviceChargeInCents > 0) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Service Charge',
        },
        unit_amount: serviceChargeInCents,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${frontendUrl}/payment/success`,
    cancel_url: `${frontendUrl}/payment/cancel`,
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