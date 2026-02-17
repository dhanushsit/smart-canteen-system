-- Supabase Schema Update (Run this in SQL Editor)

-- Add missing columns to products table if they don't exist
alter table public.products add column if not exists stock integer default 0;
alter table public.products add column if not exists meals text[]; -- Array of meal types (Breakfast, Lunch, etc.)
alter table public.products add column if not exists image text;

-- Add updated constraints/indexes if needed
create index if not exists idx_products_category on public.products(category);

-- Ensure orders table has correct columns match
alter table public.orders add column if not exists payment_mode text; -- e.g., 'Razorpay', 'Test Mode'
