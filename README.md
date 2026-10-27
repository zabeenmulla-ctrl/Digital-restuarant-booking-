# Qaswa Hills Restaurant & Dining Lounge — Bijapur (Vijayapura)
### Royal Arabic & Mughlai Table Booking, Digital Payment and Smart Hospitality Management System
**Suitable for BCA Final Year Major Project**

---

## 🏛️ Location & Authentic Cultural Theme
- **Restaurant**: Qaswa Hills Restaurant & Dining Lounge
- **City**: Vijayapura (Bijapur), Karnataka
- **Landmark**: Directly Opposite the World-Famous Historic **Gol Gumbaz** Monument
- **Cuisine**: Celebrated for authentic underground wood-fired **Yemeni BBQ Mandi**, **Chicken Faham**, **Royal Adil Shahi Dum Biryanis**, **Charcoal Tandoori Platters**, and **Arabian Desserts (Kunafa & Saffron Kahwa)**.
- **Architectural Seating Zones**:
  1. **Gol Gumbaz View Terrace**: Rooftop open-air seating with an unobstructed panoramic view of the illuminated Gol Gumbaz dome.
  2. **Royal Arabic Majlis Cabins**: Traditional low-cushioned carpet pavilions for intimate family feasts and sharing grand BBQ Mandi platters.
  3. **Adil Shahi Grand Family Hall**: Palatial air-conditioned hall with Islamic archways and crystal chandeliers.
  4. **Sultan Executive Dining Lounge**: Velvet dining booths with brass lantern lighting and dedicated butler service.

---

## 🎨 Visual Design System (UI/UX)
- **Palette**:
  - **Royal Gold**: `#d4af37` / `#e5c158` (Refined accents, badges, highlights)
  - **Deep Emerald Green**: `#022c22` / `#064e3b` / `#065f46` (Authentic royal Islamic vibe)
  - **Deep Crimson / Ruby**: `#4c0519` / `#881337` (Rich culinary contrast)
  - **Night Charcoal**: `#0b100e` / `#121915` (Deep contrast background ensuring crisp typography)
- **Typography**:
  - **Royal Heritage Serif**: `Cinzel` & `Playfair Display` for palatial headings.
  - **Modern Body Sans**: `Inter` for fast, crisp legibility on mobile and desktop.

---

## 🚀 Key Modules & Capabilities

### 1. Customer Portal
- Browse seating zones with real-time capacity and Gol Gumbaz dome view indicators.
- 10-step / wizard reservation experience with concurrency-safe database-level table locking (strictly prevents double bookings).
- Optional gourmet pre-ordering attached to table reservations.
- Razorpay digital payments test simulation (UPI, Debit/Credit Card, Net Banking).
- Downloadable official PDF GST tax invoices (`jspdf` + `jspdf-autotable`) with unique invoice numbers (`INV-QSW-2026-XXXX`).
- Cryptographic QR code digital pass for 1-second host reception check-in.
- Booking cancellation with immediate automated table release.
- Verified 5-star customer ratings and reviews.

### 2. Restaurant Manager Portal (Bijapur Host Desk)
- **QR Code Check-In Terminal**: Scan or input booking reference to instantly verify guest identity, assigned table, and prevent duplicate check-ins.
- **Table Inventory Management**: Add, edit, activate, or deactivate dining tables; configure guest capacities and premium area surcharges.
- **Menu & Pricing Control**: Toggle dishes in-stock/out-of-stock and adjust prices.
- **Real-Time Occupancy & Arrivals**: Monitor today's reservations and arrivals opposite Gol Gumbaz.

### 3. Administrator Portal
- System analytics & demand charts (daily reservations, booking status breakdown).
- Master reservation ledger with invoice downloads.
- Coupon & promotional voucher manager (`GOLGUMBAZ`, `MANDIFEAST`, `BIJAPURROYAL`).
- Restaurant operational settings (advance deposit fee, GST tax rates).

### 4. BCA Viva Evaluator Role Switcher
In the top-right corner of the navigation bar, evaluators can click the **Role Switcher** to switch between **Customer (Rahul Sharma)**, **Manager (Zabeen Mulla)**, and **Administrator** in 1 click without needing multiple logins!

---

## ⚡ Quick Start Instructions

### Run Locally:
```bash
cd "C:\Users\ZABEEN MULLA\.gemini\antigravity\scratch\qaswa-hills-restaurant"
npm install
npm run dev
```
Open **`http://localhost:3000/`** in your browser.

### Build Production Bundle:
```bash
npm run build
```

---

## 📄 Database & Migration Schema
The complete PostgreSQL schema with Row Level Security (RLS) policies, concurrency exclusion constraints, and seed data is located in:
📁 `supabase/schema.sql`
