# 🌿 Anisha Spices (Aura Masale)

> **Pure Spice. Real Taste. Trusted Every Time.**  
> A full-stack, production-ready D2C e-commerce platform built with Next.js (App Router), Supabase (PostgreSQL + Auth + RLS), and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v22)
- **npm** or **pnpm** / **yarn**

### 2. Installation & Run
```bash
# Clone the repository
git clone <repo-url>
cd aura-masale

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Environment Variables (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Admin Credentials
ADMIN_EMAIL="admin@auramasale.com"
ADMIN_PASSWORD="your-admin-password"

# Razorpay (Optional for Online Payments)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Cloudinary (Product Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 🔐 Credentials for Testing

| Role | Email | Password | Access URL |
|---|---|---|---|
| **Store Admin** | `admin@auramasale.com` | `admin123` | [`/admin`](http://localhost:3000/admin) |
| **Demo Customer** | `demo@auramasale.com` | `DemoUser@123` | [`/login`](http://localhost:3000/login) |

---

## ✨ Key Features

### 🛍️ Storefront (Customer Experience)
- **Dynamic Catalog**: 13+ pure spices with multiple pack sizes (50g, 100g, 250g, 500g, 1kg).
- **Hybrid Cart**: Guest cart (cookies) + Logged-in cart (Supabase `cart_items`) with automatic merge on login.
- **Dynamic Free Delivery Bar**: Live progress bar calculating amount needed for free delivery.
- **1-Click Checkout**: Supports guest checkout + saved addresses with COD by default and Razorpay integration.
- **Live Order Tracking**: Customer account dashboard (`/account/orders`) with status stepper (*Placed ➔ Packed ➔ Shipped ➔ Delivered*).
- **Address Book**: Manage multiple delivery addresses with default selection (`/account/addresses`).

### 🛡️ Admin Dashboard (`/admin`)
- **Mobile Responsive Drawer**: Hamburger menu with slide-out navigation on phones and tablets.
- **Real-Time Overview**: Live revenue, orders counter, customer count, and product metrics.
- **Product & Variant Manager**: Add/edit products, manage multiple pack weights, prices, and stock.
- **Category Management**: Create and manage categories with auto-slug generation.
- **Order Processing**: View customer details, shipping address, update order status, and track payments.
- **Customer Directory**: Active/suspended toggles and order counts.
- **Delivery Settings (`/admin/settings/shipping`)**: Dynamic control over free shipping threshold and standard delivery fees.
- **Marketing & Content**: Top announcement ticker, hero slider, and global FAQ management.

---

## 🗄️ Database Architecture & Setup (Supabase PostgreSQL)

### 1. Database Schema & Migration
The complete database schema with Row Level Security (RLS) policies and triggers is located in:
👉 [`supabase/migrations/00001_initial_schema.sql`](supabase/migrations/00001_initial_schema.sql)

To apply the schema to your Supabase project:
1. Open your **Supabase Dashboard** ➔ Go to **SQL Editor**.
2. Paste the contents of `00001_initial_schema.sql` and click **Run**.

### 2. Core Tables Overview

| Table | Purpose | Key Relationships |
|---|---|---|
| `profiles` | Users & Admin directory with RBAC | `auth.users(id)` |
| `categories` | Spice categories & internal system config | Self-contained, slug indexed |
| `products` | Base product information | `category_id ➔ categories(id)` |
| `product_variants` | Pack weights (50g, 100g, 250g, 500g, 1kg), prices & stock | `product_id ➔ products(id)` |
| `orders` | Customer orders, shipping snapshot & COD/Razorpay status | `user_id ➔ profiles(id)` |
| `order_items` | Purchased items snapshot with purchase price | `order_id ➔ orders(id)` |
| `addresses` | Customer saved shipping addresses | `user_id ➔ profiles(id)` |
| `cart_items` | Authenticated user shopping cart items | `user_id ➔ profiles(id)` |
| `inquiries` | Contact form submissions & newsletter subscribers | Standalone submissions |
| `hero_slides` | Homepage hero banners & CTA configuration | Standalone banner config |
| `announcements` | Top announcement bar ticker messages | Standalone banner config |
| `global_faqs` | Universal store FAQs shown on product pages | Standalone Q&A config |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, SSR)
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth Cookies & JWT)
- **Styling**: Tailwind CSS (Lucide Icons, responsive layouts)
- **Payments**: Razorpay SDK + Cash on Delivery (COD)
- **Media**: Cloudinary Upload Widget + Local WebP/JPEG Assets

---

## 📁 Project Structure

```text
├── src/
│   ├── actions/           # Next.js Server Actions (cart, checkout, shipping, admin...)
│   ├── app/
│   │   ├── (auth)/        # Login & OTP authentication pages
│   │   ├── (storefront)/  # Home, Shop, Cart, Checkout, Account, About, Contact
│   │   ├── admin/         # Admin Dashboard (Products, Orders, Customers, Settings)
│   │   └── api/           # Webhooks and backend API routes
│   ├── components/        # Reusable Storefront and Admin UI components
│   ├── constants/         # Asset paths, brand typography & colors
│   ├── contexts/          # React Contexts (CartContext, AdminNavContext)
│   └── lib/               # Supabase browser, server, and admin clients
├── supabase/              # SQL migrations and initial schema
└── public/                # Static assets, branding logo, and spice photos
```

---

## 📜 License
Private & Proprietary — Developed for **Anisha Spices**.
