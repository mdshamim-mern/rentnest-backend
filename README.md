# RentNest - Property Rental Management System Backend

RentNest is a robust, scalable, and fully featured RESTful API backend designed for a modern property rental management platform. Built using **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**, this system provides absolute role-based access control and streamlined workflows for Admins, Landlords, and Tenants.

---

## 🚀 Live Links & Credentials

- **Live API Deployment:** [https://rentnest-backend-iota.vercel.app/](https://rentnest-backend-iota.vercel.app/)
- **GitHub Repository:** [https://github.com/mdshamim-mern/rentnest-backend.git](https://github.com/mdshamim-mern/rentnest-backend.git)
- **API Documentation (Postman):** [https://documenter.getpostman.com/view/56161283/2sBY4Jy3eQ](https://documenter.getpostman.com/view/56161283/2sBY4Jy3eQ)
- **Video Demonstration:** *[Insert Video Link Here after recording]*

### 🔑 Demo Admin Credentials
- **Email:** `admin@rentnest.com`
- **Password:** `admin123`

---

## 🛠️ Technology Stack

- **Backend Framework:** Node.js with Express.js
- **Language:** TypeScript (Strict Mode)
- **Database ORM:** Prisma ORM
- **Database Engine:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT) with role-based access route guards
- **Data Validation:** Zod Schema Validation
- **Payment Gateway:** Stripe Integration

---

## 👥 Core Roles & Features

### 1. Admin Features
- **User Management:** View all registered tenants and landlords, and manage user statuses (Ban/Unban).
- **Category Management:** Full CRUD operations on property categories (e.g., Apartment, House, Studio) to dynamically structure listings.
- **Global Overview:** Monitor all global listings and cross-role rental requests.

### 2. Landlord Features
- **Property Listings Management:** Create, Read, Update, and Delete (CRUD) property listings linked directly to their profile.
- **Rental Request Control:** View all applications for their properties and change status via Approve/Reject actions.
- **Order Management:** Track completed transactions and successful payouts.

### 3. Tenant Features
- **Advanced Browsing:** Search and filter properties using dynamic queries (location, price range, category, availability).
- **Rental Request Submission:** Send clean apartment lease requests directly to specific landlords.
- **Secure Payments:** Complete payments seamlessly using integrated Stripe functionality to shift rental status to `ACTIVE`.
- **Feedback Loop:** Submit descriptive reviews and star ratings for properties after a lease is finalized.

---

## 📊 Database Architecture & Workflow Diagram

### Rental Request Lifecycle
```text
     [ PENDING ] ──(Landlord Rejects)──> [ REJECTED ]
          │
  (Landlord Approves)
          │
          ▼
     [ APPROVED ] ──(Tenant Pays via Stripe)──> [ ACTIVE (Move-In) ]
                                                       │
                                               (Lease Finalized)
                                                       │
                                                       ▼
                                                 [ COMPLETED ]