This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## App & Admin Credentials

### Admin Credentials (Neon Database)
- **Active Admin Email:** `pp436643@gmail.com`
- **Admin Password:** `admin123`

### Android App Settings
- **Android Application ID (Package Name):** `com.princeparmar.foxfalcon`

---

## AI Operating System & Multi-Agent Pipeline

The Fox Falcon Admin panel features a custom-built D2C Multi-Agent Operating System accessible at `/admin/ai`.

### 1. Key Features
- **AI Operating System Terminal:** Allows the CEO to submit clothing collection instructions.
- **Dynamic D2C Assistant Profiles:** Gemini dynamically suggests specific specialist persona profiles (avatars, titles, roles) matching the clothing drop context (e.g. *Marcus (Heavy Terry Silhouette Cutter)* or *Sophia (Techwear Trend Spotter)*).
- **Clickable Department Dossiers:** The 9 AI departments cards are clickable, opening a Dialog modal displaying the dynamic assignee details and specific deliverables.
- **CEO Approval & Rejection Gate:** Halts the pipeline under a `PENDING_APPROVAL` status, letting the CEO review research points for all 9 departments before clicking **Approve & Execute** or **Reject & Revise** with custom critiques.
- **AI Memory System:** Manually or automatically logs brand rules, color palettes, and lessons learned to `memory.json`.
- **Breadcrumb Navigation Switcher:** Organized UI view switcher separating the 4 modules:
  1. `AI Operating System`
  2. `AI Team (9 Departments)`
  3. `AI Memory System Database`
  4. `CEO Task Execution History`

### 2. Environment Configuration
To enable the live multi-agent pipeline generator, add your Gemini API Key to your `.env` file:
```env
GEMINI_API_KEY="your-actual-google-gemini-api-key"
```
*Note: If `GEMINI_API_KEY` is not set, task generation requests will return a strict `400 Bad Request` validation error instructing you to add the key.*

### 3. Currency System (Rupees ₹)
All administrative calculations, stats widgets, product editor placeholders, CSV templates, and variables are processed in Indian Rupees (`₹` / `Rs.`) instead of Dollars (`$`).



