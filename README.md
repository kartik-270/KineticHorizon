# Kinetic Horizon 🏌️‍♂️🌍

**Kinetic Horizon** is a premium golf-impact platform where precision meets purpose. Built for the modern golfer, it combines high-performance draw mechanics with meaningful global charity contributions.

## 🚀 Technical Stack

*   **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion.
*   **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
*   **Payments**: Stripe integration for subscriptions and direct donations.
*   **Identity**: JWT-based authentication with role-based access control (Admin/User).

## 🛠️ Rapid Setup

### 1. Repository Configuration
Clone the repository and install dependencies in both the root and server folders:
```bash
# Root (Frontend)
npm install

# Server (Backend)
cd server
npm install
```

### 2. Environment Synchronization
Sync your environment variables by copying the templates:
```bash
# Root
cp .env.example .env

# Server
cd server
cp .env.example .env
```
*Note: Ensure all keys (Stripe, Database, JWT) are populated in your local `.env` files.*

### 3. Database Initialization
Verify your database connection and run the migrations/seed:
```bash
cd server
npx prisma migrate dev
npm run seed
```

### 4. Stripe Webhook Testing
To test subscription events locally, use the Stripe CLI:
1.  **Login**: `stripe login`
2.  **Listen**: `stripe listen --forward-to localhost:5000/api/subscription/webhook`
3.  **Trigger**: In a new terminal, `stripe trigger checkout.session.completed`
*Note: Copy the `whsec_...` key from the `listen` command into your `server/.env` as `STRIPE_WEBHOOK_SECRET`.*

### 5. Launching Command Centers
Start the development servers concurrently:
```bash
# Terminal 1 (Frontend)
npm run dev

# Terminal 2 (Backend)
cd server
npm run dev
```

## 📐 Design Philosophy

*   **Kinetic Aesthetics**: High-fidelity golf animations and interactive mouse-tracking lights.
*   **Mobile-First Precision**: Fully optimized for mobile devices, including sticky headers and sliding drawers.
*   **Impact First**: Real-time measurement of charity contributions and system-wide visibility of mission assets.

---
*Precision. Purpose. Power.*
