# Vinaio Imports — Digital Platform

The official digital presence and B2B portal for **Vinaio Imports, Ltd.**, a premier wine and spirits importer and distributor based in New York.

## 🍷 Overview

This platform serves as both a high-end brand showcase and a functional B2B portal for licensed trade partners. It is built with performance, security, and premium aesthetics in mind.

### Core Features
- **Cinematic Experience**: Immersive, liquid-smooth animations and brand-storytelling.
- **Dynamic Portfolio**: A searchable, filterable catalog of wines, spirits, and beers synced directly from Supabase.
- **B2B Customer Portal**:
  - Secure login/registration.
  - Order history tracking.
  - Invoice management and payment status alerts.
  - TTB & State license verification tracking.
- **Admin Console**: A professional dashboard for internal teams to manage products, partners, team members, and site configuration.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: JavaScript (React 19)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **CDN / Storage**: [Bunny.net](https://bunny.net/) (for high-performance bottle assets)
- **Styling**: Vanilla CSS (Premium Matte Aesthetic)
- **Icons / Fonts**: Google Fonts (Garamond, DM Sans, Sora)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- NPM or PNPM
- A Supabase project with the appropriate schema (see `/supabase/migrations`)

### 2. Environment Setup
Copy `.env.local.example` to `.env.local` and fill in the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key # Required for Admin Panel operations
```

### 3. Installation
```bash
npm install
npm run dev
```

### 4. Deployment
The site is optimized for **Vercel**. Ensure all environment variables are set in the Vercel dashboard.

---

## 📁 Project Structure

- `src/app/` — All routes and page logic (Next.js App Router).
  - `admin/` — Internal management dashboard.
  - `portal/` — B2B trade partner experience.
  - `portfolio/` — Dynamic product catalog.
- `src/components/` — Shared UI components (Reveal, Nav, Footer, Hr, etc.).
- `src/lib/` — Shared libraries (Supabase client, theme definitions).
- `supabase/` — Database migrations and seed files.
- `public/` — Static assets (logos, fallback images).

---

## 🔒 Security & Compliance

- **Age Verification**: All users must certify legal drinking age before entering.
- **Trade Access**: Registration is restricted to licensed entities.
- **Supabase RLS**: Row Level Security is enforced across all tables to protect sensitive customer data.

## 📄 License
© 2026 Vinaio Imports, Ltd. All Rights Reserved.
