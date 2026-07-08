import express from 'express';

// সব মডিউলের রাউট ইমপোর্ট করছি
import { RentalRoutes } from '../modules/rental/rental.route';
import { PropertyRoutes } from '../modules/property/property.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { PaymentRoutes } from '../modules/payment/payment.route'; // পেমেন্ট রাউট নিয়ে আসলাম

const router = express.Router();

const moduleRoutes = [
  {
    path: '/rentals',
    route: RentalRoutes,
  },
  {
    path: '/properties',
    route: PropertyRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/payments', // এই রাউটটা মিসিং থাকার কারণেই "API Not Found" দেখাচ্ছিল
    route: PaymentRoutes,
  },
];

// লুপ চালিয়ে সব রাউট একসাথে রেজিস্টার করে দিচ্ছি
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const ApplicationRoutes = router;