-- Once a student answers Ya/Tidak, that answer is final. No more switching.
-- Enforced at the database level (not just the UI) so it can't be bypassed
-- by calling the Supabase API directly.
--
-- Named "aa_lock_attending" (not "on_profile_...") so it alphabetically runs
-- BEFORE the "on_profile_attending_change" seat-number trigger -- this way,
-- if a change gets reverted here, the seat trigger below never even sees
-- a transition happen, and correctly does nothing.

create or replace function public.lock_attending_after_first_answer()
returns trigger as $$
begin
  -- Only guards ordinary website users (the "authenticated" role). Edits made
  -- from the Supabase SQL Editor (admin role) can still override if needed.
  if auth.role() = 'authenticated'
     and old.attending is not null
     and new.attending is distinct from old.attending then
    new.attending := old.attending;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists aa_lock_attending on public.profiles;
create trigger aa_lock_attending
  before update on public.profiles
  for each row execute procedure public.lock_attending_after_first_answer();
