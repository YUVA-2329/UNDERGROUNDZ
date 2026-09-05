-- ==============================================================================
-- UNDERGROUNDZ FASHION E-COMMERCE: SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT '$',
    payment_gateway_order_id TEXT,
    payment_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'Pending Payment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index on order_id and user_id for fast queries
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view their own orders"
    ON public.orders
    FOR SELECT
    USING (
        auth.uid() = user_id 
        OR auth.jwt()->>'email' = email
    );

-- Allow inserting orders (authenticated and checkout)
CREATE POLICY "Anyone can insert orders upon checkout"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own pending orders
CREATE POLICY "Users can update their own orders"
    ON public.orders
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Optional Product Reviews Table (Ready for Genuine Customer Reviews)
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    styling_image TEXT,
    size_worn TEXT,
    color_worn TEXT,
    verified_purchase BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product reviews"
    ON public.product_reviews
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can submit reviews"
    ON public.product_reviews
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 6. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    callsign TEXT,
    sector TEXT,
    avatar_url TEXT,
    shipping_address JSONB,
    role TEXT DEFAULT 'MEMBER_VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all public profile summaries"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_callsign TEXT,
    author_avatar TEXT,
    sector TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    gear_tagged TEXT,
    verified_rider BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
    ON public.community_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
    ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TELEGRAM BOT NOTIFICATION EDGE FUNCTION INSTRUCTIONS:
--
-- 1. Deploy the Supabase Edge Function:
--    supabase functions deploy telegram-notify --no-verify-jwt
--
-- 2. Set your Telegram Bot Token and Chat ID securely in Supabase Secrets (Vault):
--    supabase secrets set TELEGRAM_BOT_TOKEN="your_bot_token" TELEGRAM_CHAT_ID="your_chat_id"
--
-- 3. (Optional) Database Webhook Trigger to dispatch Telegram alerts on new orders:
--    In Supabase Dashboard -> Database -> Webhooks -> Create Webhook:
--    Table: orders (INSERT)
--    URL: https://<PROJECT-REF>.supabase.co/functions/v1/telegram-notify
-- ==============================================================================
