-- Run this AFTER setup_profiles.sql and seat_numbers.sql have already been applied.
-- This replaces category-based teacher detection with a dedicated, locked-down
-- is_teacher flag, so a guest can never grant themselves teacher access by
-- editing their own profile (e.g. via a direct API call).

-- 1. Dedicated teacher flag. Defaults to false for everyone.
alter table public.profiles add column if not exists is_teacher boolean not null default false;

-- 2. Lock the flag: ordinary logged-in users (the "authenticated" Postgres role,
--    which is what the website always uses) can never change it themselves,
--    even by calling the API directly. Only edits made from the Supabase SQL
--    Editor (which runs as an admin role, not "authenticated") can set it.
create or replace function public.protect_is_teacher()
returns trigger as $$
begin
  if auth.role() = 'authenticated' then
    new.is_teacher := old.is_teacher;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_protect_is_teacher on public.profiles;
create trigger on_profile_protect_is_teacher
  before update on public.profiles
  for each row execute procedure public.protect_is_teacher();

-- 3. The flagged teacher account can read every student row (both attending
--    and not-yet-answered/not-attending), so the teacher gets a full roster.
--    We use a security-definer function rather than an inline subquery,
--    because an inline `exists (select ... from profiles ...)` inside a
--    policy on `profiles` re-triggers this same policy and causes
--    "infinite recursion detected in policy for relation profiles".
create or replace function public.is_current_user_teacher()
returns boolean as $$
  select coalesce(
    (select is_teacher from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

drop policy if exists "Teachers can view attending students" on public.profiles;
drop policy if exists "Teachers can view all students" on public.profiles;

create policy "Teachers can view all students"
on public.profiles for select
to authenticated
using (
  role = 'student'
  and public.is_current_user_teacher()
);

-- 4. Promote the one teacher account.
--    First create their login in Supabase Dashboard → Authentication → Users →
--    "Add user" (pick the exact email + password the teacher will use, and
--    tick "Auto Confirm User"). Signing up there auto-creates their blank
--    profiles row via the existing trigger. THEN run the line below, replacing
--    the email with the one you just created:

-- update public.profiles
-- set is_teacher = true, role = 'guest', full_name = 'Cikgu ...'
-- where email = 'teacher@example.com';
