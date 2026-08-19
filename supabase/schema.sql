-- ==========================================
-- Holy Ghost Academy Secondary School, Awka
-- Supabase PostgreSQL Schema Definition
-- ==========================================

-- Enable standard UUID extensions if needed
create extension if not exists "uuid-ossp";

-- 1. NEWS & ANNOUNCEMENTS TABLE
create table public.news (
  id text primary key,
  title text not null,
  content text not null,
  category text not null check (category in ('Academic', 'Announcement', 'Sports', 'Event')),
  image_url text,
  is_published boolean not null default true,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. INFRASTRUCTURE PROJECTS TABLE
create table public.projects (
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

-- 3. GALLERY CATALOG TABLE
create table public.gallery (
  id text primary key,
  image_url text not null,
  title text not null,
  category text not null,
  upload_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. VIDEO LIBRARIES TABLE
create table public.videos (
  id text primary key,
  title text not null,
  url text not null,
  description text,
  upload_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ACADEMIC DOCUMENTS & DOWNLOADS TABLE
create table public.documents (
  id text primary key,
  title text not null,
  file_type text not null,
  file_size text not null,
  download_url text not null,
  upload_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. STUDENT REPORT CARDS & TERMINAL RESULTS TABLE
-- Nested scores are mapped elegantly to a native JSONB column matching our client SubjectScore[] structure.
create table public.student_results (
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
  -- Ensure a student only has one report card record per term and academic session
  constraint unique_student_report_term_session unique (student_id, term, academic_session)
);

-- Create index on student_id for lightning fast portal results lookup
create index idx_student_results_student_id on public.student_results(student_id);

-- 7. CONTACT MESSAGES & INQUIRIES TABLE
create table public.contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  date text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- =========================================================================
-- SECURITY RULES: ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
alter table public.news enable row level security;
alter table public.projects enable row level security;
alter table public.gallery enable row level security;
alter table public.videos enable row level security;
alter table public.documents enable row level security;
alter table public.student_results enable row level security;
alter table public.contact_messages enable row level security;

-- A. PUBLIC READ POLICIES (Everyone can read public academic resources, news, gallery, etc.)
create policy "Allow public read access to news" on public.news
  for select using (is_published = true);

create policy "Allow public read access to projects" on public.projects
  for select using (true);

create policy "Allow public read access to gallery" on public.gallery
  for select using (true);

create policy "Allow public read access to videos" on public.videos
  for select using (true);

create policy "Allow public read access to documents" on public.documents
  for select using (true);

create policy "Allow public read access to student_results" on public.student_results
  for select using (true);

-- B. PUBLIC WRITE POLICIES (Everyone can send a contact message/inquiry)
create policy "Allow public inserts to contact_messages" on public.contact_messages
  for insert with check (true);


-- C. ADMIN CONTROL POLICIES (Only authenticated Supabase users/admin can modify content)
-- Update auth.role() = 'authenticated' matches admin users signed in through Supabase Auth.

-- News
create policy "Admin can insert news" on public.news for insert with check (auth.role() = 'authenticated');
create policy "Admin can update news" on public.news for update using (auth.role() = 'authenticated');
create policy "Admin can delete news" on public.news for delete using (auth.role() = 'authenticated');

-- Projects
create policy "Admin can insert projects" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Admin can update projects" on public.projects for update using (auth.role() = 'authenticated');
create policy "Admin can delete projects" on public.projects for delete using (auth.role() = 'authenticated');

-- Gallery
create policy "Admin can insert gallery" on public.gallery for insert with check (auth.role() = 'authenticated');
create policy "Admin can update gallery" on public.gallery for update using (auth.role() = 'authenticated');
create policy "Admin can delete gallery" on public.gallery for delete using (auth.role() = 'authenticated');

-- Videos
create policy "Admin can insert videos" on public.videos for insert with check (auth.role() = 'authenticated');
create policy "Admin can update videos" on public.videos for update using (auth.role() = 'authenticated');
create policy "Admin can delete videos" on public.videos for delete using (auth.role() = 'authenticated');

-- Documents
create policy "Admin can insert documents" on public.documents for insert with check (auth.role() = 'authenticated');
create policy "Admin can update documents" on public.documents for update using (auth.role() = 'authenticated');
create policy "Admin can delete documents" on public.documents for delete using (auth.role() = 'authenticated');

-- Student Results
create policy "Admin can insert student_results" on public.student_results for insert with check (auth.role() = 'authenticated');
create policy "Admin can update student_results" on public.student_results for update using (auth.role() = 'authenticated');
create policy "Admin can delete student_results" on public.student_results for delete using (auth.role() = 'authenticated');

-- Contact Messages (Admin access only for viewing/updating is_read/deleting)
create policy "Admin can select contact_messages" on public.contact_messages for select using (auth.role() = 'authenticated');
create policy "Admin can update contact_messages" on public.contact_messages for update using (auth.role() = 'authenticated');
create policy "Admin can delete contact_messages" on public.contact_messages for delete using (auth.role() = 'authenticated');
