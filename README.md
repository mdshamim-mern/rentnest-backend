### Repository Description
Robust and scalable backend architecture for the RentNest property rental application. Built with Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL. Features role-based access control, JWT authentication, and Stripe integration. Live: https://rentnest-backend-iota.vercel.app/

### Topics (Tags)
nodejs, expressjs, typescript, prisma, postgresql, jwt, stripe, mern, rentnest-backend, role-based-access, backend-development

---

# RentNest - Property Rental Management System Backend

RentNest is a robust, scalable, and fully featured RESTful API backend designed for a modern property rental management platform. Built using Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL, this system provides absolute role-based access control and streamlined workflows for Admins, Landlords, and Tenants.

*(Consider adding a screenshot of your Postman API Docs or Database ER Diagram here)*

## 🚀 Live Links & Credentials

- **Live API Deployment:** https://rentnest-backend-iota.vercel.app/
- **GitHub Repository:** https://github.com/mdshamim-mern/rentnest-backend.git
- **API Documentation (Postman):** https://documenter.getpostman.com/view/56161283/2sBY4Jy3eQ
- **Video Demonstration:** [Watch Video Here](#)

### 🔑 Demo Admin Credentials
- **Email:** admin@rentnest.com
- **Password:** admin123

## 🛠️ Technology Stack & Dependencies

- **Backend Framework:** Node.js with Express.js
- **Language:** TypeScript (Strict Mode)
- **Database ORM:** Prisma ORM
- **Database Engine:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT) with role-based access route guards
- **Data Validation:** Zod Schema Validation
- **Payment Gateway:** Stripe Integration
- **Core Dependencies:** `bcrypt`, `cors`, `dotenv`, `jsonwebtoken`, `express`, `prisma`, `zod`, `stripe`

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
- **Secure Payments:** Complete payments seamlessly using integrated Stripe functionality to shift rental status to ACTIVE.
- **Feedback Loop:** Submit descriptive reviews and star ratings for properties after a lease is finalized.

## 📊 Database Architecture & Workflow Diagram

**Rental Request Lifecycle**

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

## ⚙️ How to Run Locally

Follow these steps to set up the project on your local machine:

**1. Clone the repository:**
git clone https://github.com/mdshamim-mern/rentnest-backend.git
cd rentnest-backend

**2. Install dependencies:**
npm install

**3. Set up environment variables:**
Create a `.env` file in the root directory and add the following configuration:

PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/rentnest"
JWT_SECRET="your_super_secret_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"

**4. Run Prisma Migrations:**
npx prisma migrate dev
npx prisma generate

**5. Start the server:**
npm run dev

*(The server will start on http://localhost:5000)*