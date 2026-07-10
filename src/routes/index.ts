import express from 'express';
import { RentalRoutes } from '../modules/rental/rental.route';
import { PropertyRoutes } from '../modules/property/property.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { LandlordRoutes } from '../modules/landlord/landlord.route';
import { AdminRoutes } from '../modules/admin/admin.route';

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
    path: '/payments', 
    route: PaymentRoutes,
  },
  {
    path: '/landlord', 
    route: LandlordRoutes,
  },
  {
    path: '/admin', 
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export const ApplicationRoutes = router;