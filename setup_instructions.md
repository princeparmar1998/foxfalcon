# Setup Instructions - Parmar Clothings

To get the project running, follow these steps:

## 1. Environment Variables
Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/parmar_clothings"

NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

STRIPE_API_KEY="your-stripe-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

NEXT_PUBLIC_PUSHER_APP_ID="your-pusher-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"
```

## 2. Database Setup
Once you have PostgreSQL running and the `DATABASE_URL` configured:

```bash
npx prisma generate
npx prisma db push
```

## 3. Running Locally
```bash
npm run dev
```

## 4. Admin Access
To access the admin panel at `/admin`, you'll need to update your user role to `ADMIN` in the database after signing up.

## 5. Deployment
This project is optimized for Vercel. Ensure you add all environment variables in the Vercel dashboard.
