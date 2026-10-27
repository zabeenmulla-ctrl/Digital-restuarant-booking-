-- ========================================================================
-- QASWA HILLS RESTAURANT & HOTEL TABLE BOOKING SYSTEM
-- COMPLETE DATABASE SCHEMA & SUPABASE MIGRATION
-- Suitable for BCA Final Year Major Project
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------
-- 1. PROFILES & ROLE-BASED ACCESS CONTROL
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 2. RESTAURANTS & VENUES
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cover_image TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    rating NUMERIC(2, 1) DEFAULT 4.9,
    total_reviews INT DEFAULT 142,
    price_range VARCHAR(10) DEFAULT '₹₹₹',
    opening_time TIME DEFAULT '11:00:00',
    closing_time TIME DEFAULT '23:30:00',
    default_deposit_fee NUMERIC(10, 2) DEFAULT 500.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 3. DINING ZONES / SEATING SECTIONS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_outdoor BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 4. RESTAURANT TABLES
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES public.restaurant_zones(id) ON DELETE SET NULL,
    table_number VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity >= 1),
    min_guests INT NOT NULL DEFAULT 1,
    category VARCHAR(50) NOT NULL DEFAULT 'Standard' CHECK (category IN (
        'Two-person Table', 
        'Four-person Table', 
        'Six-person Table', 
        'Family Dining Table', 
        'Royal VIP Cabana', 
        'Hill-View Terrace Table', 
        'Executive Private Room'
    )),
    floor_area VARCHAR(50) DEFAULT 'Main Deck',
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    extra_fee NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, table_number)
);

-- ------------------------------------------------------------------------
-- 5. MENU CATEGORIES & ITEMS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    is_veg BOOLEAN DEFAULT TRUE,
    is_spicy BOOLEAN DEFAULT FALSE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 6. BOOKINGS & CONCURRENCY CONSTRAINTS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE RESTRICT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(25) NOT NULL,
    guest_count INT NOT NULL CHECK (guest_count >= 1),
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    duration_minutes INT DEFAULT 120,
    status VARCHAR(30) NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
        'pending_payment',
        'confirmed',
        'checked_in',
        'completed',
        'cancelled',
        'no_show'
    )),
    special_requests TEXT,
    occasion VARCHAR(50) DEFAULT 'Casual Dining',
    deposit_amount NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    food_total NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    qr_code_token TEXT UNIQUE,
    checked_in_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent concurrent duplicate bookings for same table, date & time slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking 
ON public.bookings (table_id, booking_date, time_slot) 
WHERE status IN ('confirmed', 'checked_in', 'pending_payment');

-- ------------------------------------------------------------------------
-- 7. PAYMENTS & TRANSACTIONS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    provider VARCHAR(50) DEFAULT 'Razorpay',
    order_id VARCHAR(100),
    payment_id VARCHAR(100),
    payment_signature VARCHAR(255),
    payment_method VARCHAR(50) DEFAULT 'UPI',
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'created',
        'pending',
        'successful',
        'failed',
        'cancelled',
        'refunded'
    )),
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 8. DIGITAL INVOICES & BILLS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    tax_rate NUMERIC(4, 2) DEFAULT 5.00, -- 5% GST
    tax_amount NUMERIC(10, 2) NOT NULL,
    grand_total NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    balance_due NUMERIC(10, 2) DEFAULT 0.00,
    payment_status VARCHAR(30) DEFAULT 'paid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid', 'refunded')),
    invoice_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    item_description TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- ------------------------------------------------------------------------
-- 9. PRE-ORDERED FOOD (OPTIONAL EXTENSION)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled')),
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.food_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_order_id UUID REFERENCES public.food_orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    item_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- ------------------------------------------------------------------------
-- 10. REVIEWS & RATINGS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 11. PROMOTIONAL OFFERS & COUPONS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    max_discount NUMERIC(10, 2),
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 12. NOTIFICATIONS & AUDIT LOGS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- INDEXES FOR FAST QUERIES
-- ------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_restaurant ON public.bookings (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments (booking_id);
CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON public.restaurant_tables (restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON public.menu_items (restaurant_id);

-- ------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read restaurants, zones, tables, menus, reviews, promotions
CREATE POLICY "Public read restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Public read zones" ON public.restaurant_zones FOR SELECT USING (true);
CREATE POLICY "Public read tables" ON public.restaurant_tables FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Public read menu items" ON public.menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public read promotions" ON public.promotions FOR SELECT USING (is_active = true);

-- Profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = auth_user_id);

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = bookings.user_id)
    OR auth.uid() IS NULL
);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Payments policies
CREATE POLICY "Users can read own payments" ON public.payments FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = payments.user_id)
    OR auth.uid() IS NULL
);

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = invoices.user_id)
    OR auth.uid() IS NULL
);

-- Notifications policies
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (
    auth.uid() IN (SELECT auth_user_id FROM public.profiles WHERE id = notifications.user_id)
    OR auth.uid() IS NULL
);

-- ========================================================================
-- SEED DATA FOR QASWA HILLS RESTAURANT
-- ========================================================================
DO $$
DECLARE
    v_restaurant_id UUID := 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
    v_zone_terrace UUID := 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e';
    v_zone_garden UUID := 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f';
    v_zone_cabana UUID := 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a';
    v_zone_royal UUID := 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b';
    v_cat_starters UUID := 'f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c';
    v_cat_mains UUID := 'a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d';
    v_cat_biryani UUID := 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e';
    v_cat_beverages UUID := 'c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f';
    v_cat_desserts UUID := 'd2e3f4a5-b6c7-8d9e-0f1a-2b3c4d5e6f7a';
BEGIN
    -- Insert Restaurant
    INSERT INTO public.restaurants (id, name, slug, tagline, description, address, city, phone, email, cover_image, rating, total_reviews, price_range, default_deposit_fee)
    VALUES (
        v_restaurant_id,
        'Qaswa Hills Restaurant & Dining Lounge',
        'qaswa-hills-restaurant',
        'Luxury Hill-View Gourmet Experience & Table Reservation',
        'Perched atop scenic misty cliffs, Qaswa Hills offers an unmatched fine-dining sanctuary blending Royal Mughlai, Mediterranean delights, and authentic Continental grilled specialties with panoramic sunset mountain vistas.',
        'Plot 14, Sunset Ridge Road, Panorama Viewpoint, Scenic Hills',
        'Mahabaleshwar / Lonavala Scenic Hills',
        '+91 98234 56789',
        'contact@qaswahills.com',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        4.9,
        186,
        '₹₹₹',
        500.00
    ) ON CONFLICT (id) DO NOTHING;

    -- Insert Dining Zones
    INSERT INTO public.restaurant_zones (id, restaurant_id, name, description, image_url, is_outdoor, display_order)
    VALUES
    (v_zone_terrace, v_restaurant_id, 'Summit Hill Terrace', 'Open-air cliffside seating with unobstructed 360-degree mountain & sunset views.', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80', true, 1),
    (v_zone_garden, v_restaurant_id, 'Glasshouse Botanical Lawn', 'Enchanting glasshouse garden with ambient fairy lights and lush flora.', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80', true, 2),
    (v_zone_cabana, v_restaurant_id, 'Royal VIP Hill Cabanas', 'Exclusive private curtained pavilions with dedicated butler service and cozy heaters.', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80', false, 3),
    (v_zone_royal, v_restaurant_id, 'Grand Heritage Hall', 'Palatial indoor chandelier banquet seating with climate control and classical live music.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', false, 4)
    ON CONFLICT (id) DO NOTHING;

    -- Insert Tables
    INSERT INTO public.restaurant_tables (restaurant_id, zone_id, table_number, capacity, min_guests, category, floor_area, is_premium, extra_fee)
    VALUES
    -- Terrace
    (v_restaurant_id, v_zone_terrace, 'T-01 (Cliffside Edge)', 2, 1, 'Two-person Table', 'Terrace Deck', true, 200.00),
    (v_restaurant_id, v_zone_terrace, 'T-02 (Sunset Front)', 2, 1, 'Two-person Table', 'Terrace Deck', true, 200.00),
    (v_restaurant_id, v_zone_terrace, 'T-03 (Panorama Quad)', 4, 2, 'Four-person Table', 'Terrace Center', false, 0.00),
    (v_restaurant_id, v_zone_terrace, 'T-04 (Skyline Table)', 4, 2, 'Four-person Table', 'Terrace Center', false, 0.00),
    (v_restaurant_id, v_zone_terrace, 'T-05 (Summit Family)', 6, 4, 'Six-person Table', 'Terrace Gazebo', false, 0.00),
    -- Garden
    (v_restaurant_id, v_zone_garden, 'G-01 (Orchid Corner)', 2, 1, 'Two-person Table', 'Garden Deck', false, 0.00),
    (v_restaurant_id, v_zone_garden, 'G-02 (Fountain Side)', 4, 2, 'Four-person Table', 'Garden Lawn', false, 0.00),
    (v_restaurant_id, v_zone_garden, 'G-03 (Breeze Canopy)', 4, 2, 'Four-person Table', 'Garden Lawn', false, 0.00),
    (v_restaurant_id, v_zone_garden, 'G-04 (Lawn Pavilion)', 6, 4, 'Six-person Table', 'Garden Pavilion', false, 0.00),
    (v_restaurant_id, v_zone_garden, 'G-05 (Botanical Group)', 8, 5, 'Family Dining Table', 'Garden Lawn', false, 0.00),
    -- Cabana
    (v_restaurant_id, v_zone_cabana, 'CAB-1 (Sultan Pavilion)', 4, 2, 'Royal VIP Cabana', 'Cabana Walkway', true, 500.00),
    (v_restaurant_id, v_zone_cabana, 'CAB-2 (Mughal Suite)', 6, 3, 'Royal VIP Cabana', 'Cabana Walkway', true, 600.00),
    (v_restaurant_id, v_zone_cabana, 'CAB-3 (Imperial Pod)', 8, 4, 'Royal VIP Cabana', 'Cabana Viewpoint', true, 800.00),
    -- Royal Hall
    (v_restaurant_id, v_zone_royal, 'H-01 (Chandelier Pair)', 2, 1, 'Two-person Table', 'Royal Hall West', false, 0.00),
    (v_restaurant_id, v_zone_royal, 'H-02 (Classic Four)', 4, 2, 'Four-person Table', 'Royal Hall West', false, 0.00),
    (v_restaurant_id, v_zone_royal, 'H-03 (Family Feast)', 6, 4, 'Six-person Table', 'Royal Hall Center', false, 0.00),
    (v_restaurant_id, v_zone_royal, 'H-04 (Royal Banquet)', 12, 6, 'Family Dining Table', 'Royal Hall Center', true, 500.00),
    (v_restaurant_id, v_zone_royal, 'H-VIP (Executive Dining)', 10, 5, 'Executive Private Room', 'Private Chamber', true, 1000.00)
    ON CONFLICT DO NOTHING;

    -- Insert Menu Categories
    INSERT INTO public.menu_categories (id, restaurant_id, name, display_order)
    VALUES
    (v_cat_starters, v_restaurant_id, 'Appetizers & Sizzlers', 1),
    (v_cat_mains, v_restaurant_id, 'Royal Curries & Specialties', 2),
    (v_cat_biryani, v_restaurant_id, 'Dum Biryani & Artisanal Breads', 3),
    (v_cat_beverages, v_restaurant_id, 'Gourmet Mocktails & Brews', 4),
    (v_cat_desserts, v_restaurant_id, 'Handcrafted Desserts', 5)
    ON CONFLICT (id) DO NOTHING;

    -- Insert Menu Items
    INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, is_veg, is_spicy, is_chef_special, image_url)
    VALUES
    (v_restaurant_id, v_cat_starters, 'Qaswa Smoked Galouti Kebab', 'Melt-in-mouth tender minced mutton infused with 32 hill spices, served on saffron sheermal.', 580.00, false, false, true, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_starters, 'Paneer Tikka Angara', 'Charcoal-grilled cottage cheese cubes marinated in Kashmiri chili and smoked mustard oil.', 420.00, true, true, false, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_starters, 'Crispy Lotus Stem Honey Chili', 'Thinly sliced lotus root tossed in honey, sesame seeds and fresh scallions.', 390.00, true, false, false, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_mains, 'Qaswa Handi Ghost', 'Slow-cooked lamb shank stewed for 8 hours in an earthen clay pot with aromatic bone marrow gravy.', 690.00, false, true, true, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_mains, 'Dal Qaswa Royale', 'Signature black lentils slow-simmered overnight over white embers, finished with churned butter and cream.', 390.00, true, false, true, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_mains, 'Murgh Lababdar', 'Tender charred chicken breast simmered in a luscious onion-tomato and cashew satin gravy.', 520.00, false, false, false, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_biryani, 'Nawabi Dum Mutton Biryani', 'Long-grain royal basmati rice cooked on dum with succulent goat meat, saffron, and caramelized onions.', 640.00, false, true, true, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_biryani, 'Subz Nizami Biryani', 'Fragrant basmati layered with garden-fresh winter vegetables, mint, rose water and crisp nuts.', 440.00, true, false, false, 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_biryani, 'Butter Garlic Naan Platter', 'Tandoor-baked flaky naan brushed with clarified garlic butter and fresh cilantro.', 140.00, true, false, false, 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_beverages, 'Misty Ridge Passion Fruit Cooler', 'Fresh passion fruit puree, crushed mint, sparkling water, and Himalayan pink salt.', 240.00, true, false, true, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_beverages, 'Royal Saffron Kahwa', 'Traditional Kashmiri green tea brewed with saffron strands, whole green cardamom, and slivered almonds.', 180.00, true, false, false, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_desserts, 'Shahi Tukda with Rabri', 'Golden saffron-soaked brioche crowned with slow-reduced thick pistachio rabri and silver leaf.', 290.00, true, false, true, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80'),
    (v_restaurant_id, v_cat_desserts, 'Hot Sizzling Brownie with Vanilla Pod Gelato', 'Warm Belgian chocolate walnut brownie served on a cast-iron skillet with hot fudge.', 320.00, true, false, false, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80')
    ON CONFLICT DO NOTHING;

    -- Insert Promotions
    INSERT INTO public.promotions (code, title, description, discount_type, discount_value, min_spend, max_discount, valid_until)
    VALUES
    ('QASWA10', 'Welcome to Qaswa Hills', 'Get 10% instant off on advance table reservation fees', 'percentage', 10.00, 400.00, 200.00, '2026-12-31'),
    ('HILLVIEW20', 'Sunset Deck Special', 'Save 20% on all Terrace and Cliffside reservations', 'percentage', 20.00, 500.00, 400.00, '2026-12-31'),
    ('ROYALCABANA', 'VIP Luxury Discount', 'Flat ₹300 off on Private Hill Cabanas', 'flat', 300.00, 1000.00, 300.00, '2026-12-31')
    ON CONFLICT (code) DO NOTHING;
END $$;
