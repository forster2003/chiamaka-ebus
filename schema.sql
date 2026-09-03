-- =========================================================================
-- Holy Ghost Academy Secondary School, Awka
-- Complete Supabase PostgreSQL Schema Script
-- =========================================================================
-- This script sets up all database tables, constraints, indexes,
-- and Row Level Security (RLS) policies for the school web portal.
--
-- HOW TO RUN IN SUPABASE:
-- 1. Open your Supabase project dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" in the left navigation sidebar
-- 3. Click "New query", paste this entire script, and click "Run" (Ctrl+Enter)
-- =========================================================================

-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. NEWS & ANNOUNCEMENTS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.news (
  id text primary key,
  title text not null,
  content text not null,
  category text not null check (category in ('Academic', 'Announcement', 'Sports', 'Event')),
  image_url text,
  is_published boolean not null default true,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 2. INFRASTRUCTURE & SCHOOL PROJECTS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.projects (
  id text primary key,
  title text not null,
  description text not null,
  image_url text not null,
  budget text not null,
  start_date date not null,
  expected_completion_date date not null,
  percentage_completion integer not null default 0 check (percentage_completion >= 0 and percentage_completion <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 3. PHOTO GALLERY CATALOG TABLE
-- -------------------------------------------------------------------------
create table if not exists public.gallery (
  id text primary key,
  image_url text not null,
  title text not null,
  category text not null,
  upload_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 4. VIDEO RESOURCE LIBRARIES TABLE
-- -------------------------------------------------------------------------
create table if not exists public.videos (
  id text primary key,
  title text not null,
  url text not null,
  description text,
  upload_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 5. ACADEMIC DOCUMENTS & DOWNLOADS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.documents (
  id text primary key,
  title text not null,
  file_type text not null,
  file_size text not null,
  download_url text not null,
  upload_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 6. STUDENT REPORT CARDS & TERMINAL RESULTS TABLE
-- -------------------------------------------------------------------------
-- Nested subject scores (testScore, examScore, grade, remarks) are stored in JSONB
create table if not exists public.student_results (
  id text primary key,
  student_id text not null,
  student_name text not null,
  class_level text not null,
  term text not null,
  academic_session text not null,
  gender text not null,
  roll_number text not null,
  position text not null,
  attendance text not null,
  principal_remarks text,
  teacher_remarks text,
  subject_scores jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_student_report_term_session unique (student_id, term, academic_session)
);

-- -------------------------------------------------------------------------
-- 7. CONTACT MESSAGES & INQUIRIES TABLE
-- -------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  date text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- 8. SCHOOL FEES & DIRECT BANK PAYMENT TRANSACTIONS TABLE
-- -------------------------------------------------------------------------
create table if not exists public.payments (
  id text primary key,
  reference_number text not null unique,
  payer_name text not null,
  payer_phone text not null,
  payer_email text,
  student_name text not null,
  student_id text,
  class_level text not null,
  purpose text not null,
  amount numeric not null check (amount >= 0),
  payment_date date not null default current_date,
  payment_method text not null,
  bank_reference text not null,
  proof_image_url text,
  remarks text,
  status text not null default 'Pending Verification' check (status in ('Verified', 'Pending Verification', 'Rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -------------------------------------------------------------------------
-- INDEXES FOR OPTIMIZED QUERY PERFORMANCE
-- -------------------------------------------------------------------------
create index if not exists idx_news_date on public.news(date desc);
create index if not exists idx_projects_start_date on public.projects(start_date desc);
create index if not exists idx_gallery_upload_date on public.gallery(upload_date desc);
create index if not exists idx_student_results_student_id on public.student_results(student_id);
create index if not exists idx_student_results_class on public.student_results(class_level, academic_session, term);
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index if not exists idx_payments_reference_number on public.payments(reference_number);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_student_id on public.payments(student_id);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
-- Enable RLS across all tables
alter table public.news enable row level security;
alter table public.projects enable row level security;
alter table public.gallery enable row level security;
alter table public.videos enable row level security;
alter table public.documents enable row level security;
alter table public.student_results enable row level security;
alter table public.contact_messages enable row level security;
alter table public.payments enable row level security;

-- Drop existing default policies if re-running script to avoid conflicts
drop policy if exists "Allow all access to news" on public.news;
drop policy if exists "Allow all access to projects" on public.projects;
drop policy if exists "Allow all access to gallery" on public.gallery;
drop policy if exists "Allow all access to videos" on public.videos;
drop policy if exists "Allow all access to documents" on public.documents;
drop policy if exists "Allow all access to student_results" on public.student_results;
drop policy if exists "Allow all access to contact_messages" on public.contact_messages;
drop policy if exists "Allow all access to payments" on public.payments;

-- Standard policies for client-side web application with publishable/anon key:
create policy "Allow all access to news" on public.news
  for all using (true) with check (true);

create policy "Allow all access to projects" on public.projects
  for all using (true) with check (true);

create policy "Allow all access to gallery" on public.gallery
  for all using (true) with check (true);

create policy "Allow all access to videos" on public.videos
  for all using (true) with check (true);

create policy "Allow all access to documents" on public.documents
  for all using (true) with check (true);

create policy "Allow all access to student_results" on public.student_results
  for all using (true) with check (true);

create policy "Allow all access to contact_messages" on public.contact_messages
  for all using (true) with check (true);

create policy "Allow all access to payments" on public.payments
  for all using (true) with check (true);
