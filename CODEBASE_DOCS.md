# 🦊 Fox Falcon — Complete Codebase Documentation

> **Project**: Fox Falcon — Premium Streetwear E-commerce  
> **Tech Stack**: Next.js 14 (App Router) + Prisma 7 + PostgreSQL (Neon) + NextAuth + TailwindCSS + Zustand  
> **Last Updated**: 30 May 2026  
> **Repository**: `princeparmar1998/foxfalcon`

---

## 📁 Project Structure

```
f:/parmarClothings/
├── prisma/
│   └── schema.prisma          # Database schema (Users, Products, Orders, etc.)
├── prisma.config.ts           # Prisma v7 config (datasource URL from .env)
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── layout.tsx         # Root layout (Providers, Navbar, Footer)
│   │   ├── page.tsx           # Home page (Hero, Categories, Features, CTA)
│   │   ├── globals.css        # Tailwind CSS design tokens (light + dark theme)
│   │   ├── login/page.tsx     # Login (Credentials + Google OAuth)
│   │   ├── register/page.tsx  # User registration
│   │   ├── shop/page.tsx      # Product listing with filters, search, sort
│   │   ├── shop/[id]/page.tsx # Product detail (gallery, sizes, add-to-cart)
│   │   ├── cart/page.tsx      # Shopping cart with quantity controls
│   │   ├── checkout/page.tsx  # Checkout (saved addresses, COD / Card payment)
│   │   ├── wishlist/page.tsx  # Wishlist (persisted via Zustand localStorage)
│   │   ├── profile/page.tsx   # User profile, orders, addresses
│   │   ├── collections/page.tsx  # Collections browse page
│   │   ├── custom-design/page.tsx # T-shirt custom design uploader
│   │   ├── track-order/page.tsx   # Real-time order tracking (Pusher)
│   │   ├── admin/             # Admin panel (Dashboard, Products, Orders, Customers, Analytics, Settings)
│   │   │   ├── layout.tsx     # Admin sidebar layout
│   │   │   ├── page.tsx       # Admin dashboard (stats, charts)
│   │   │   ├── products/      # Product CRUD management
│   │   │   ├── orders/        # Order management with status updates
│   │   │   ├── customers/     # Customer list & details
│   │   │   ├── analytics/     # Analytics page
│   │   │   └── settings/      # Settings page
│   │   └── api/               # Backend API routes
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │       ├── register/route.ts            # POST user registration
│   │       ├── products/route.ts            # GET all / POST new product
│   │       ├── products/[id]/route.ts       # GET single product
│   │       ├── checkout/route.ts            # POST create order
│   │       ├── user/orders/route.ts         # GET user's orders
│   │       ├── user/addresses/route.ts      # GET/POST/DELETE addresses
│   │       ├── user/profile/route.ts        # PATCH update profile
│   │       ├── admin/products/route.ts      # GET/POST products (admin)
│   │       ├── admin/products/[id]/route.ts # DELETE/PATCH product (admin)
│   │       ├── admin/products/upload/route.ts # POST image upload
│   │       ├── admin/orders/route.ts        # GET all orders (admin)
│   │       ├── admin/orders/[id]/route.ts   # PATCH order status (admin)
│   │       ├── admin/customers/route.ts     # GET all customers (admin)
│   │       ├── admin/stats/route.ts         # GET dashboard stats (admin)
│   │       └── admin/seed/route.ts          # GET seed admin user
│   ├── components/
│   │   ├── navbar.tsx         # Global navbar (role-based links)
│   │   ├── hero.tsx           # Animated hero section (parallax)
│   │   ├── footer.tsx         # Site footer with newsletter
│   │   ├── modal-developer.tsx # Developer credit modal
│   │   ├── providers.tsx      # SessionProvider + ThemeProvider + Toaster
│   │   └── ui/               # shadcn/ui components (18 components)
│   ├── hooks/
│   │   ├── use-cart.ts        # Zustand cart store (localStorage persist)
│   │   ├── use-wishlist.ts    # Zustand wishlist store (localStorage persist)
│   │   └── use-order-tracking.ts # Pusher real-time order tracking
│   ├── lib/
│   │   ├── api.ts             # Centralized Axios API client
│   │   ├── auth.ts            # NextAuth config (Credentials + Google + PrismaAdapter)
│   │   ├── db.ts              # Prisma client singleton (with pg driver adapter)
│   │   ├── pusher.ts          # Pusher server & client (defensive null checks)
│   │   ├── toast.ts           # Global toast utility (wraps Sonner)
│   │   └── utils.ts           # cn() utility for classnames
│   └── types/
│       └── next-auth.d.ts     # NextAuth type augmentation (id, role)
├── public/                    # Static assets (logo, hero-bg, uploads/)
├── seed_admin.js              # Standalone admin seeder script
├── package.json               # Dependencies & scripts
├── next.config.mjs            # Next.js config (image domains)
├── tailwind.config.ts         # Tailwind config
└── .env                       # Environment variables (DB, auth, etc.)
```

---

## 🗄️ Database Schema (Prisma)

| Model | Key Fields | Relations |
|-------|-----------|-----------|
| **User** | id, name, email, password, role (USER/ADMIN) | accounts, sessions, orders, wishlist, addresses, customDesigns |
| **Account** | userId, provider, providerAccountId | belongs to User |
| **Session** | sessionToken, userId, expires | belongs to User |
| **Product** | name, description, price, images[], categoryId, inventory, sizes[], colors[], isFeatured | belongs to Category, has OrderItems, Wishlists |
| **Category** | name (unique) | has Products |
| **Order** | userId, totalAmount, status (PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED), addressId, stripeSessionId | belongs to User & Address, has OrderItems |
| **OrderItem** | orderId, productId, quantity, price, size, color | belongs to Order & Product |
| **Wishlist** | userId (unique) | belongs to User, has Products (many-to-many) |
| **Address** | userId, street, city, state, postalCode, country, isDefault | belongs to User, has Orders |
| **CustomDesign** | userId, imageUrl, designData (JSON) | belongs to User |

---

## 🔐 Authentication System

- **Provider**: NextAuth v4 with JWT strategy
- **Auth Methods**: 
  - Email + Password (CredentialsProvider) using `bcryptjs`
  - Google OAuth (requires `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)
- **Adapter**: PrismaAdapter (stores accounts/sessions in DB)
- **JWT Callbacks**: Fetch user from DB on every JWT refresh → injects `id`, `role`, `email`, `name` into token
- **Session Callbacks**: Passes `role` and `id` to the client session
- **Admin Credentials**: `admin@foxfalcon.com` / `admin123`

---

## 🔌 API Routes Summary

### Public APIs
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List all products (filter: categoryId, isFeatured) |
| GET | `/api/products/[id]` | Get single product details |
| POST | `/api/register` | Register new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth endpoints |

### User APIs (requires session)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/orders` | Get logged-in user's orders |
| GET/POST/DELETE | `/api/user/addresses` | Manage user addresses |
| PATCH | `/api/user/profile` | Update user name |
| POST | `/api/checkout` | Create order (COD or Card) |

### Admin APIs (requires ADMIN role)
| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/admin/products` | List/create products |
| DELETE/PATCH | `/api/admin/products/[id]` | Delete/update product |
| POST | `/api/admin/products/upload` | Upload product image |
| GET | `/api/admin/orders` | List all orders |
| PATCH | `/api/admin/orders/[id]` | Update order status (+ Pusher notification) |
| GET | `/api/admin/customers` | List all customers with stats |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/seed` | Seed admin user |

---

## 🛒 State Management

| Store | Library | Persistence | Purpose |
|-------|---------|-------------|---------|
| Cart | Zustand | localStorage (`cart-storage`) | Cart items, add/remove/update quantity |
| Wishlist | Zustand | localStorage (`wishlist-storage`) | Wishlist toggle, check if item exists |
| Session | NextAuth | JWT (server) / SessionProvider (client) | User auth state |

---

## 🎨 Design System

- **Theme**: Dark mode default (`next-themes`, attribute: `class`)
- **Primary Color**: Fox Falcon Brand Orange (HSL `20 100% 55%`)
- **Secondary Color**: Sleek Metallic Silver (HSL `210 10% 85%` dark)
- **Typography**: Inter (Google Font) + Geist Sans/Mono (local)
- **UI Library**: shadcn/ui (18 components installed)
- **Animations**: Framer Motion (hero parallax, page transitions, AnimatePresence)
- **Icons**: Lucide React
- **Toasts**: Sonner (with custom `showToast` wrapper utility)

---

## 🌐 Deployment & Environment

### Required `.env` Variables
```
DATABASE_URL="postgresql://..."          # Neon Postgres connection string
NEXTAUTH_SECRET="your_secret"            # JWT signing secret
NEXTAUTH_URL="https://your-domain.com"   # App URL (Vercel auto-sets this)
GOOGLE_CLIENT_ID="..."                   # (optional) Google OAuth
GOOGLE_CLIENT_SECRET="..."               # (optional) Google OAuth
NEXT_PUBLIC_PUSHER_APP_ID="..."          # (optional) Pusher real-time
NEXT_PUBLIC_PUSHER_KEY="..."             # (optional) Pusher
PUSHER_SECRET="..."                      # (optional) Pusher server-side
NEXT_PUBLIC_PUSHER_CLUSTER="..."         # (optional) Pusher
```

### Vercel Deployment Notes
- **Build Command**: `prisma generate && next build` (configured in package.json)
- **Prisma Driver**: Uses `@prisma/adapter-pg` (driver adapter) with `pg` Pool — NO native query engine
- **Password Hashing**: `bcryptjs` (pure JS — Vercel compatible, NOT native `bcrypt`)
- **Image Upload**: Falls back to base64 data URL on Vercel (read-only filesystem)
- **Pusher**: Defensive null checks — app works without Pusher credentials configured

---

## ⚠️ Known Limitations & Technical Debt

1. **Image Storage**: Currently local filesystem / base64 fallback. **Needs Cloudinary or AWS S3** for production.
2. **Reviews System**: Static placeholder (`4.8 / 42 Reviews`). No review model in DB yet.
3. **Search**: Client-side only. No server-side search/pagination.
4. **Payment**: Dummy card payment simulator. No real Stripe integration (Stripe dependency exists but unused).
5. **Google OAuth**: Uses placeholder `dummy-google-client-id` if env vars not set.
6. **GitHub Login**: Button exists in UI but no provider configured.
7. **Footer Links**: `/shop/men`, `/shop/women`, `/contact`, `/shipping`, `/returns` — pages don't exist yet.
8. **Newsletter**: UI only — no backend integration.
9. **Admin Auth on Production**: Admin routes use `isDev` bypass for local dev — works correctly on Vercel (NODE_ENV=production enforces ADMIN role check).
10. **`cn()` duplicate**: Defined both in `lib/utils.ts` and locally in `shop/[id]/page.tsx` and `checkout/page.tsx`.

---

## 🚀 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # prisma generate && next build
npm run start    # Start production server
npm run lint     # ESLint
node seed_admin.js  # Seed admin user directly (standalone script)
```

---

## 📋 Future Improvements Roadmap

| Priority | Feature | Notes |
|----------|---------|-------|
| 🔴 High | Cloud image storage (Cloudinary/S3) | Replace local fs upload |
| 🔴 High | Real Stripe payment integration | Use existing Stripe dependency |
| 🟡 Medium | Product reviews & ratings | New Review model in Prisma |
| 🟡 Medium | Server-side search + pagination | For large product catalogs |
| 🟡 Medium | Google OAuth setup | Needs real credentials |
| 🟢 Low | Newsletter backend (Mailchimp/Resend) | Email subscription |
| 🟢 Low | Missing pages (contact, shipping, returns) | Footer links |
| 🟢 Low | Remove duplicate `cn()` helper functions | Cleanup |

---

## 🤖 AI Update Prompt

Use this prompt in your next conversation to update this documentation:

```
Mujhe is project ki docs update karni hai. Pehle ye file padho:
f:/parmarClothings/CODEBASE_DOCS.md

Phir poora codebase review kro — saari nayi files, changes, nayi APIs, nayi pages,
schema changes, nayi dependencies, aur koi bhi important updates check kro.

Phir CODEBASE_DOCS.md ko update kro with:
- Naye sections agar koi nayi feature add hui ho
- Updated API routes table
- Updated DB schema table
- Updated environment variables agar koi nayi ho
- Updated known limitations (jo fix ho gayi wo hatao, nayi add kro)
- Updated roadmap
- Ye prompt section wahi rehne do (isko mat badlo)

Sirf wo cheezein update kro jo actually change hui hain. Baaki sab same rehne do.
```
