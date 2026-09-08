-- =========================================================================
-- Holy Ghost Academy Secondary School, Awka (HGASS)
-- Dedicated Supabase SQL Script: SUBJECTS OFFERED & CURRICULUM
-- Motto: Moral and Academics (MALU CHUKWU, MALU AKWUKO)
-- =========================================================================

-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. TABLE DEFINITION: SCHOOL SUBJECTS & CURRICULUM
-- =========================================================================

create table if not exists public.subjects (
  id text primary key,
  name text not null,
  category text not null check (category in ('Sciences', 'Arts & Humanities', 'Commercial', 'Vocational & Tech', 'Junior General', 'Languages')),
  level text not null check (level in ('Junior Secondary (JSS)', 'Senior Secondary (SSS)', 'All Levels')),
  description text default '',
  "desc" text default '', -- Dual column alias ensuring queries/inserts using either "desc" or "description" succeed
  is_core boolean not null default false,
  syllabus_code text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist for existing tables (safe incremental migration)
alter table public.subjects add column if not exists description text default '';
alter table public.subjects add column if not exists "desc" text default '';
alter table public.subjects add column if not exists is_core boolean not null default false;
alter table public.subjects add column if not exists syllabus_code text;
alter table public.subjects add column if not exists display_order integer default 0;
alter table public.subjects add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- =========================================================================
-- 2. AUTOMATIC TRIGGER: DESCRIPTION SYNCHRONIZATION
-- =========================================================================

create or replace function public.sync_subject_description()
returns trigger as $$
begin
  if new.description is null or new.description = '' then
    new.description := coalesce(new."desc", '');
  end if;
  if new."desc" is null or new."desc" = '' then
    new."desc" := coalesce(new.description, '');
  end if;
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_subject_description on public.subjects;
create trigger trg_sync_subject_description
before insert or update on public.subjects
for each row execute function public.sync_subject_description();

-- =========================================================================
-- 3. PERFORMANCE INDEXES
-- =========================================================================

create index if not exists idx_subjects_category on public.subjects(category);
create index if not exists idx_subjects_level on public.subjects(level);
create index if not exists idx_subjects_is_core on public.subjects(is_core);
create index if not exists idx_subjects_display_order on public.subjects(display_order asc);

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table public.subjects enable row level security;

-- Drop prior policy definitions to prevent duplicates
drop policy if exists "Allow all access to subjects" on public.subjects;
drop policy if exists "Allow read access to subjects" on public.subjects;
drop policy if exists "Allow insert access to subjects" on public.subjects;
drop policy if exists "Allow update access to subjects" on public.subjects;
drop policy if exists "Allow delete access to subjects" on public.subjects;

-- Universal read & write access for the web portal
create policy "Allow all access to subjects" on public.subjects
  for all
  using (true)
  with check (true);

-- =========================================================================
-- 5. CONVENIENCE VIEWS BY ACADEMIC DIVISION
-- =========================================================================

-- View: Junior Secondary Curriculum
create or replace view public.junior_secondary_subjects as
  select * from public.subjects
  where level in ('Junior Secondary (JSS)', 'All Levels')
  order by is_core desc, display_order asc, name asc;

-- View: Senior Secondary Curriculum
create or replace view public.senior_secondary_subjects as
  select * from public.subjects
  where level in ('Senior Secondary (SSS)', 'All Levels')
  order by category asc, is_core desc, display_order asc, name asc;

-- View: Core Mandatory Subjects
create or replace view public.core_curriculum_subjects as
  select * from public.subjects
  where is_core = true
  order by level asc, name asc;

-- =========================================================================
-- 6. OFFICIAL SEED DATA: SUBJECTS OFFERED AT HGASS
-- =========================================================================

insert into public.subjects (
  id,
  name,
  category,
  level,
  description,
  "desc",
  is_core,
  syllabus_code,
  display_order
)
values
  -- 1. MATHEMATICS (Core)
  (
    'subj-1',
    'Mathematics',
    'Sciences',
    'All Levels',
    'Arithmetic, algebra, Euclidean geometry, trigonometry, statistics, and logical problem solving aligned with national WAEC and NECO standards.',
    'Arithmetic, algebra, Euclidean geometry, trigonometry, statistics, and logical problem solving aligned with national WAEC and NECO standards.',
    true,
    'WAEC-402',
    1
  ),

  -- 2. ENGLISH LANGUAGE (Core)
  (
    'subj-2',
    'English Language',
    'Languages',
    'All Levels',
    'Grammar mechanics, oral diction phonetics, continuous essay writing, comprehension reading, and summary synthesis.',
    'Grammar mechanics, oral diction phonetics, continuous essay writing, comprehension reading, and summary synthesis.',
    true,
    'WAEC-302',
    2
  ),

  -- 3. CIVIC EDUCATION (Core)
  (
    'subj-3',
    'Civic Education',
    'Arts & Humanities',
    'All Levels',
    'Constitutional rights, democratic values, citizenship obligations, national ethics, peace studies, and societal responsibilities.',
    'Constitutional rights, democratic values, citizenship obligations, national ethics, peace studies, and societal responsibilities.',
    true,
    'WAEC-204',
    3
  ),

  -- 4. CHRISTIAN RELIGIOUS STUDIES (CRS - Core)
  (
    'subj-4',
    'Christian Religious Studies (CRS)',
    'Arts & Humanities',
    'All Levels',
    'Biblical theology, apostolic history, moral discernment, ethical leadership, and character formation based on Gospel teachings.',
    'Biblical theology, apostolic history, moral discernment, ethical leadership, and character formation based on Gospel teachings.',
    true,
    'WAEC-205',
    4
  ),

  -- 5. PHYSICS (Sciences)
  (
    'subj-5',
    'Physics',
    'Sciences',
    'Senior Secondary (SSS)',
    'Classical mechanics, wave phenomena, heat thermodynamics, optics, electrostatics, electromagnetism, and atomic physics with intensive laboratory practicums.',
    'Classical mechanics, wave phenomena, heat thermodynamics, optics, electrostatics, electromagnetism, and atomic physics with intensive laboratory practicums.',
    false,
    'WAEC-512',
    5
  ),

  -- 6. CHEMISTRY (Sciences)
  (
    'subj-6',
    'Chemistry',
    'Sciences',
    'Senior Secondary (SSS)',
    'Inorganic chemistry, physical calculations, volumetric & qualitative quantitative analysis, organic reactions, and environmental applications.',
    'Inorganic chemistry, physical calculations, volumetric & qualitative quantitative analysis, organic reactions, and environmental applications.',
    false,
    'WAEC-505',
    6
  ),

  -- 7. BIOLOGY (Sciences)
  (
    'subj-7',
    'Biology',
    'Sciences',
    'Senior Secondary (SSS)',
    'Cellular biology, physiology, human anatomy, ecology, genetics, evolutionary concepts, and microscopic laboratory investigations.',
    'Cellular biology, physiology, human anatomy, ecology, genetics, evolutionary concepts, and microscopic laboratory investigations.',
    false,
    'WAEC-504',
    7
  ),

  -- 8. FURTHER MATHEMATICS (Sciences)
  (
    'subj-8',
    'Further Mathematics',
    'Sciences',
    'Senior Secondary (SSS)',
    'Advanced pure mathematics: vectors, matrices, calculus, differentiation, coordinate geometry, mechanics, and probability theory.',
    'Advanced pure mathematics: vectors, matrices, calculus, differentiation, coordinate geometry, mechanics, and probability theory.',
    false,
    'WAEC-401',
    8
  ),

  -- 9. AGRICULTURAL SCIENCE (Sciences)
  (
    'subj-9',
    'Agricultural Science',
    'Sciences',
    'All Levels',
    'Crop production, soil science, animal husbandry, farm mechanization, agricultural economics, and practical school farm demonstrations.',
    'Crop production, soil science, animal husbandry, farm mechanization, agricultural economics, and practical school farm demonstrations.',
    false,
    'WAEC-502',
    9
  ),

  -- 10. COMPUTER SCIENCE / ICT (Vocational & Tech)
  (
    'subj-10',
    'Computer Science & ICT',
    'Vocational & Tech',
    'All Levels',
    'Information technology foundations, computer programming concepts, database management, networking, web basics, and digital office suites.',
    'Information technology foundations, computer programming concepts, database management, networking, web basics, and digital office suites.',
    true,
    'WAEC-705',
    10
  ),

  -- 11. ECONOMICS (Commercial)
  (
    'subj-11',
    'Economics',
    'Commercial',
    'Senior Secondary (SSS)',
    'Microeconomics, supply & demand dynamics, price theory, national income accounting, banking, inflation, and international trade.',
    'Microeconomics, supply & demand dynamics, price theory, national income accounting, banking, inflation, and international trade.',
    false,
    'WAEC-402',
    11
  ),

  -- 12. FINANCIAL ACCOUNTING (Commercial)
  (
    'subj-12',
    'Financial Accounting',
    'Commercial',
    'Senior Secondary (SSS)',
    'Double-entry book-keeping, balance sheets, ledger adjustments, cash books, partnership accounts, and company financial statements.',
    'Double-entry book-keeping, balance sheets, ledger adjustments, cash books, partnership accounts, and company financial statements.',
    false,
    'WAEC-401',
    12
  ),

  -- 13. COMMERCE (Commercial)
  (
    'subj-13',
    'Commerce',
    'Commercial',
    'Senior Secondary (SSS)',
    'Domestic and overseas trade, advertising, warehousing, capital markets, business ethics, and consumer rights protection.',
    'Domestic and overseas trade, advertising, warehousing, capital markets, business ethics, and consumer rights protection.',
    false,
    'WAEC-403',
    13
  ),

  -- 14. LITERATURE IN ENGLISH (Arts & Humanities)
  (
    'subj-14',
    'Literature in English',
    'Arts & Humanities',
    'Senior Secondary (SSS)',
    'African and non-African prose, Shakespearean and modern drama, poetic analysis, literary appreciation, and rhetorical devices.',
    'African and non-African prose, Shakespearean and modern drama, poetic analysis, literary appreciation, and rhetorical devices.',
    false,
    'WAEC-301',
    14
  ),

  -- 15. GOVERNMENT (Arts & Humanities)
  (
    'subj-15',
    'Government',
    'Arts & Humanities',
    'Senior Secondary (SSS)',
    'Forms and arms of government, political ideologies, Nigerian constitutional development, public administration, and foreign policy.',
    'Forms and arms of government, political ideologies, Nigerian constitutional development, public administration, and foreign policy.',
    false,
    'WAEC-208',
    15
  ),

  -- 16. BASIC SCIENCE (Junior General)
  (
    'subj-16',
    'Basic Science',
    'Junior General',
    'Junior Secondary (JSS)',
    'Introductory living & non-living organisms, solar system, energy transformations, matter, environmental sanitation, and scientific observation.',
    'Introductory living & non-living organisms, solar system, energy transformations, matter, environmental sanitation, and scientific observation.',
    true,
    'BECE-101',
    16
  ),

  -- 17. BASIC TECHNOLOGY (Vocational & Tech)
  (
    'subj-17',
    'Basic Technology',
    'Vocational & Tech',
    'Junior Secondary (JSS)',
    'Technical drawing instruments, woodworking, metalwork processing, basic mechanisms, simple electronics, and technical safety.',
    'Technical drawing instruments, woodworking, metalwork processing, basic mechanisms, simple electronics, and technical safety.',
    true,
    'BECE-102',
    17
  ),

  -- 18. BUSINESS STUDIES (Commercial)
  (
    'subj-18',
    'Business Studies',
    'Commercial',
    'Junior Secondary (JSS)',
    'Fundamentals of office practice, commercial arithmetic, keyboarding skills, bookkeeping principles, and petty cash operations.',
    'Fundamentals of office practice, commercial arithmetic, keyboarding skills, bookkeeping principles, and petty cash operations.',
    false,
    'BECE-103',
    18
  ),

  -- 19. IGBO LANGUAGE & CULTURE (Languages)
  (
    'subj-19',
    'Igbo Language & Culture',
    'Languages',
    'All Levels',
    'Asusu Igbo grammar (Utoasusu), orthography, Igbo literature (Agumagu), cultural heritage, idioms (Ilu), and folklore traditions.',
    'Asusu Igbo grammar (Utoasusu), orthography, Igbo literature (Agumagu), cultural heritage, idioms (Ilu), and folklore traditions.',
    false,
    'WAEC-303',
    19
  ),

  -- 20. FRENCH LANGUAGE (Languages)
  (
    'subj-20',
    'French Language',
    'Languages',
    'All Levels',
    'Basic French phonetics, conversational dialogue, conjugation, vocabulary building, reading comprehension, and francophone cultural awareness.',
    'Basic French phonetics, conversational dialogue, conjugation, vocabulary building, reading comprehension, and francophone cultural awareness.',
    false,
    'WAEC-304',
    20
  ),

  -- 21. TECHNICAL DRAWING (Vocational & Tech)
  (
    'subj-21',
    'Technical Drawing',
    'Vocational & Tech',
    'Senior Secondary (SSS)',
    'Isometric projection, orthographic drafting, geometrical constructions, architectural floor plans, and engineering sketching.',
    'Isometric projection, orthographic drafting, geometrical constructions, architectural floor plans, and engineering sketching.',
    false,
    'WAEC-703',
    21
  ),

  -- 22. HISTORY (Arts & Humanities)
  (
    'subj-22',
    'History',
    'Arts & Humanities',
    'Senior Secondary (SSS)',
    'Pre-colonial Nigerian kingdoms, colonial era transformations, nationalist struggles, independence era, and contemporary African diplomacy.',
    'Pre-colonial Nigerian kingdoms, colonial era transformations, nationalist struggles, independence era, and contemporary African diplomacy.',
    false,
    'WAEC-209',
    22
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  level = excluded.level,
  description = excluded.description,
  "desc" = excluded."desc",
  is_core = excluded.is_core,
  syllabus_code = excluded.syllabus_code,
  display_order = excluded.display_order,
  updated_at = timezone('utc'::text, now());
