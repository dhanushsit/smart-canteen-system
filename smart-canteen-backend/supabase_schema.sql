-- SUPABASE MIGRATION SCHEMA
-- Run this in the SQL Editor of your Supabase Dashboard

-- 1. Create Users Table (Managed by App Logic, not Supabase Auth)
create table public.users (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text unique,
  password text not null, -- Stores bcrypt hash
  role text default 'student', -- 'admin', 'distributor', 'student'
  balance numeric default 0,
  verified boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Products Table (Menu Items)
create table public.products (
  id text primary key,
  name text not null,
  price numeric not null,
  category text,
  image text,
  description text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create Orders Table
create table public.orders (
  id text primary key,
  user_id text references public.users(id),
  items jsonb not null, -- Stores array of ordered items with qty
  total numeric not null,
  status text default 'Pending', -- 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'
  date timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create Complaints Table
create table public.complaints (
  id text primary key,
  user_id text references public.users(id),
  message text not null,
  status text default 'Pending', -- 'Pending', 'Resolved'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Create Settings Table (Singleton)
create table public.settings (
  id int primary key default 1,
  breakfast boolean default true,
  lunch boolean default true,
  dinner boolean default true,
  snacks boolean default true
);

-- Initialize default settings
insert into public.settings (id, breakfast, lunch, dinner, snacks)
values (1, true, true, true, true)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS) is optional since backend logic handles checks
-- for now, we can leave it off or enable it for stricter control.
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.complaints enable row level security;
alter table public.settings enable row level security;

-- Policies (Optional: Allow public access if using Service Role Key in backend)
-- If using anon key, define policies here.
create policy "Public Access" on public.products for select using (true);
