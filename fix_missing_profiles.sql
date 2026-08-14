-- 1. Backfill: create a profiles row for any auth.users account that's
--    missing one (covers accounts registered before the trigger existed,
--    or created via the Supabase Dashboard before it was wired up).
insert into public.profiles (id, email)
select u.id, u.email
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

-- 2. Confirm the auto-create trigger is actually active, so this doesn't
--    happen again for new signups. Should return one row.
select tgname, tgenabled
from pg_trigger
where tgname = 'on_auth_user_created';
