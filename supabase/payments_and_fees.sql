-- =========================================================================
-- Holy Ghost Academy Secondary School, Awka (HGASS)
-- Dedicated Supabase SQL Script: PAYMENTS, TUITION FEES & FINANCIAL LEDGER
-- Motto: Moral and Academics (MALU CHUKWU, MALU AKWUKO)
-- Official Bank: United Bank for Africa (UBA)
-- =========================================================================

-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. TABLE DEFINITION: PAYMENTS (TRANSACTIONS & DIRECT BANK RECEIPTS)
-- =========================================================================

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
  verified_by text,
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safe incremental migrations for existing installations
alter table public.payments add column if not exists reference_number text;
alter table public.payments add column if not exists payer_name text;
alter table public.payments add column if not exists payer_phone text;
alter table public.payments add column if not exists payer_email text;
alter table public.payments add column if not exists student_name text;
alter table public.payments add column if not exists student_id text;
alter table public.payments add column if not exists class_level text;
alter table public.payments add column if not exists purpose text;
alter table public.payments add column if not exists amount numeric default 0;
alter table public.payments add column if not exists payment_date date default current_date;
alter table public.payments add column if not exists payment_method text;
alter table public.payments add column if not exists bank_reference text;
alter table public.payments add column if not exists proof_image_url text;
alter table public.payments add column if not exists remarks text;
alter table public.payments add column if not exists status text default 'Pending Verification';
alter table public.payments add column if not exists verified_by text;
alter table public.payments add column if not exists verified_at timestamp with time zone;
alter table public.payments add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- =========================================================================
-- 2. TABLE DEFINITION: OFFICIAL FEE SCHEDULES (TUITION, BOARDING, & LEVIES)
-- =========================================================================

create table if not exists public.fee_schedules (
  id text primary key,
  class_tier text not null check (class_tier in ('Junior Secondary (JSS 1 - JSS 3)', 'Senior Secondary (SSS 1 - SSS 3)', 'General / All Classes')),
  student_type text not null check (student_type in ('Day Student', 'Boarding Student', 'Both')),
  academic_term text not null default '1st Term',
  academic_session text not null default '2026/2027',
  tuition_fee numeric not null default 0,
  boarding_fee numeric not null default 0,
  ict_levy numeric not null default 0,
  science_lab_fee numeric not null default 0,
  medical_development_levy numeric not null default 0,
  pta_levy numeric not null default 0,
  total_payable numeric not null default 0,
  due_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 3. TABLE DEFINITION: OFFICIAL SCHOOL BANK ACCOUNTS
-- =========================================================================

create table if not exists public.bank_accounts (
  id text primary key,
  bank_name text not null,
  account_name text not null,
  account_number text not null unique,
  account_type text not null default 'Current Account',
  branch text,
  purpose_category text not null default 'All School Fees & Levies',
  is_active boolean not null default true,
  sort_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 4. AUTOMATIC TRIGGERS
-- =========================================================================

-- Trigger to auto-update payments timestamp & verification time
create or replace function public.process_payment_timestamp()
returns trigger as $$
begin
  new.updated_at := timezone('utc'::text, now());
  if new.status = 'Verified' and (old.status is distinct from 'Verified' or new.verified_at is null) then
    new.verified_at := timezone('utc'::text, now());
  elsif new.status <> 'Verified' then
    new.verified_at := null;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_process_payment_timestamp on public.payments;
create trigger trg_process_payment_timestamp
before insert or update on public.payments
for each row execute function public.process_payment_timestamp();

-- Trigger to auto-calculate total payable in fee schedules
create or replace function public.calculate_fee_schedule_total()
returns trigger as $$
begin
  new.total_payable := coalesce(new.tuition_fee, 0)
    + coalesce(new.boarding_fee, 0)
    + coalesce(new.ict_levy, 0)
    + coalesce(new.science_lab_fee, 0)
    + coalesce(new.medical_development_levy, 0)
    + coalesce(new.pta_levy, 0);
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_calculate_fee_schedule_total on public.fee_schedules;
create trigger trg_calculate_fee_schedule_total
before insert or update on public.fee_schedules
for each row execute function public.calculate_fee_schedule_total();

-- =========================================================================
-- 5. PERFORMANCE INDEXES
-- =========================================================================

create index if not exists idx_payments_reference_number on public.payments(reference_number);
create index if not exists idx_payments_student_id on public.payments(student_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_payment_date on public.payments(payment_date desc);
create index if not exists idx_payments_purpose on public.payments(purpose);
create index if not exists idx_payments_class_level on public.payments(class_level);
create index if not exists idx_fee_schedules_tier on public.fee_schedules(class_tier, student_type);

-- =========================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table public.payments enable row level security;
alter table public.fee_schedules enable row level security;
alter table public.bank_accounts enable row level security;

-- Drop prior policy definitions to prevent duplicates
drop policy if exists "Allow all access to payments" on public.payments;
drop policy if exists "Allow all access to fee_schedules" on public.fee_schedules;
drop policy if exists "Allow all access to bank_accounts" on public.bank_accounts;

-- Universal read & write access for the web portal
create policy "Allow all access to payments" on public.payments
  for all using (true) with check (true);

create policy "Allow all access to fee_schedules" on public.fee_schedules
  for all using (true) with check (true);

create policy "Allow all access to bank_accounts" on public.bank_accounts
  for all using (true) with check (true);

-- =========================================================================
-- 7. CONVENIENCE VIEWS FOR BURSARY & ACCOUNTING
-- =========================================================================

-- View: Verified Payments Only
create or replace view public.verified_payments as
  select 
    id,
    reference_number,
    payer_name,
    payer_phone,
    student_name,
    student_id,
    class_level,
    purpose,
    amount,
    payment_date,
    payment_method,
    bank_reference,
    remarks,
    verified_at,
    created_at
  from public.payments
  where status = 'Verified'
  order by payment_date desc;

-- View: Pending Verification Queue
create or replace view public.pending_payments as
  select 
    id,
    reference_number,
    payer_name,
    payer_phone,
    payer_email,
    student_name,
    student_id,
    class_level,
    purpose,
    amount,
    payment_date,
    payment_method,
    bank_reference,
    proof_image_url,
    remarks,
    created_at
  from public.payments
  where status = 'Pending Verification'
  order by created_at desc;

-- View: Revenue Summary by Purpose
create or replace view public.revenue_summary_by_purpose as
  select 
    purpose,
    count(*) as transaction_count,
    sum(case when status = 'Verified' then amount else 0 end) as total_verified_amount,
    sum(case when status = 'Pending Verification' then amount else 0 end) as total_pending_amount
  from public.payments
  group by purpose
  order by total_verified_amount desc;

-- =========================================================================
-- 8. OFFICIAL SEED DATA: HGASS BANK ACCOUNTS
-- =========================================================================

insert into public.bank_accounts (
  id,
  bank_name,
  account_name,
  account_number,
  account_type,
  branch,
  purpose_category,
  is_active,
  sort_code
)
values
  (
    'bank-uba-tuition',
    'United Bank for Africa (UBA)',
    'Holy Ghost Academy Secondary School, Awka',
    '1023456789',
    'Current Account',
    'Enugu Road Branch, Awka, Anambra State',
    'School Fees, Tuition & Admissions',
    true,
    '033080012'
  ),
  (
    'bank-uba-boarding',
    'United Bank for Africa (UBA)',
    'Holy Ghost Academy Boarding & Welfare',
    '1023456790',
    'Current Account',
    'Enugu Road Branch, Awka, Anambra State',
    'Boarding, Hostel Maintenance & Feeding',
    true,
    '033080012'
  ),
  (
    'bank-uba-pta',
    'United Bank for Africa (UBA)',
    'Holy Ghost Academy PTA Development Account',
    '1023456791',
    'Current Account',
    'Zik Avenue Branch, Awka, Anambra State',
    'PTA Levies, Building Projects & Donations',
    true,
    '033080015'
  )
on conflict (id) do update set
  bank_name = excluded.bank_name,
  account_name = excluded.account_name,
  account_number = excluded.account_number,
  branch = excluded.branch,
  purpose_category = excluded.purpose_category,
  is_active = excluded.is_active;

-- =========================================================================
-- 9. OFFICIAL SEED DATA: FEE SCHEDULE (2026/2027 ACADEMIC SESSION)
-- =========================================================================

insert into public.fee_schedules (
  id,
  class_tier,
  student_type,
  academic_term,
  academic_session,
  tuition_fee,
  boarding_fee,
  ict_levy,
  science_lab_fee,
  medical_development_levy,
  pta_levy,
  due_date,
  notes
)
values
  -- JSS Day Students
  (
    'fee-jss-day',
    'Junior Secondary (JSS 1 - JSS 3)',
    'Day Student',
    '1st Term',
    '2026/2027',
    45000,
    0,
    10000,
    5000,
    5000,
    5000,
    '2026-09-30',
    'Includes tuition, digital computer laboratory access, library fee, and terminal continuous assessments.'
  ),
  -- JSS Boarding Students
  (
    'fee-jss-boarding',
    'Junior Secondary (JSS 1 - JSS 3)',
    'Boarding Student',
    '1st Term',
    '2026/2027',
    45000,
    100000,
    10000,
    5000,
    8000,
    5000,
    '2026-09-30',
    'Includes full boarding lodging, balanced 3-meal dietary feeding, laundry utility, and 24/7 infirmary healthcare.'
  ),
  -- SSS Day Students
  (
    'fee-sss-day',
    'Senior Secondary (SSS 1 - SSS 3)',
    'Day Student',
    '1st Term',
    '2026/2027',
    55000,
    0,
    12000,
    10000,
    5000,
    5000,
    '2026-09-30',
    'Includes senior subject science reagents, WAEC/NECO practical mock prep, and advanced ICT workshops.'
  ),
  -- SSS Boarding Students
  (
    'fee-sss-boarding',
    'Senior Secondary (SSS 1 - SSS 3)',
    'Boarding Student',
    '1st Term',
    '2026/2027',
    55000,
    105000,
    12000,
    10000,
    8000,
    5000,
    '2026-09-30',
    'Comprehensive senior boarding tuition, hostel accommodations, STEM labs, supervised night preps, and feeding.'
  )
on conflict (id) do update set
  tuition_fee = excluded.tuition_fee,
  boarding_fee = excluded.boarding_fee,
  ict_levy = excluded.ict_levy,
  science_lab_fee = excluded.science_lab_fee,
  medical_development_levy = excluded.medical_development_levy,
  pta_levy = excluded.pta_levy,
  notes = excluded.notes,
  updated_at = timezone('utc'::text, now());

-- =========================================================================
-- 10. OFFICIAL SEED DATA: SAMPLE PAYMENTS & RECEIPTS
-- =========================================================================

insert into public.payments (
  id,
  reference_number,
  payer_name,
  payer_phone,
  payer_email,
  student_name,
  student_id,
  class_level,
  purpose,
  amount,
  payment_date,
  payment_method,
  bank_reference,
  remarks,
  status,
  verified_by
)
values
  (
    'pay-1',
    'HGA-PAY-2026-88310',
    'Mrs. Ngozi Ezeokafor',
    '+234 803 555 1234',
    'ngozi.ezeokafor@yahoo.com',
    'Chinedu Okafor',
    'HGASS/2026/001',
    'SS 2',
    'School Fees / Tuition',
    75000,
    '2026-08-10',
    'UBA Direct Bank Transfer',
    'UBA/TRX/998271625',
    '1st Term 2026/2027 Academic Session Tuition Fee for Chinedu Okafor (SS 2 Science).',
    'Verified',
    'Bursar Anthony Maduka'
  ),
  (
    'pay-2',
    'HGA-PAY-2026-54129',
    'Engr. Patrick Nnamdi',
    '+234 812 777 9081',
    'p.nnamdi@gmail.com',
    'Somtochukwu Nnamdi',
    'HGASS/2026/015',
    'JSS 2',
    'Boarding & Hostel Fees',
    145000,
    '2026-08-15',
    'Mobile Banking App',
    'TRF/UBA/1027146728/0029',
    'Full Boarding, hostel maintenance, and feeding fees for JSS 2 term.',
    'Verified',
    'Bursar Anthony Maduka'
  ),
  (
    'pay-3',
    'HGA-PAY-2026-31908',
    'Chief Emmanuel Udeh',
    '+234 802 444 8812',
    'chiefudeh@outlook.com',
    'Kamsiyochukwu Udeh',
    'HGASS/PROSPECT/084',
    'Prospective Student',
    'Admission & Application Form',
    10000,
    '2026-08-18',
    'USSD Transfer',
    'USSD/UBA/77621458',
    'JSS 1 Entrance Examination registration form and prospectus payment.',
    'Pending Verification',
    null
  ),
  (
    'pay-4',
    'HGA-PAY-2026-10492',
    'Dr. & Mrs. Okey Nwankwo',
    '+234 803 911 2233',
    'okey.nwankwo@yahoo.com',
    'Chioma Nwankwo',
    'HGASS/2026/042',
    'SS 1',
    'PTA Levy & Development Fund',
    15000,
    '2026-08-20',
    'Bank Branch Teller Deposit',
    'TELLER/UBA/AWK/44810',
    'Annual PTA building development contribution & sports jersey levy.',
    'Verified',
    'Bursar Anthony Maduka'
  )
on conflict (id) do update set
  reference_number = excluded.reference_number,
  payer_name = excluded.payer_name,
  payer_phone = excluded.payer_phone,
  payer_email = excluded.payer_email,
  student_name = excluded.student_name,
  student_id = excluded.student_id,
  class_level = excluded.class_level,
  purpose = excluded.purpose,
  amount = excluded.amount,
  payment_date = excluded.payment_date,
  payment_method = excluded.payment_method,
  bank_reference = excluded.bank_reference,
  remarks = excluded.remarks,
  status = excluded.status,
  updated_at = timezone('utc'::text, now());
