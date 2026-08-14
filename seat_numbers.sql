-- Run this in Supabase SQL Editor. Replaces the old "release back to pool" logic
-- with permanent, never-reused seat numbers.
--
-- New behavior:
--   - A student gets a seat number the first time they ever confirm "Ya".
--   - That number is theirs forever -- switching to "Tidak" no longer clears it.
--   - Switching back to "Ya" later does NOT get a new number (they already have one).
--   - Numbers are never reused, so gaps can appear if someone permanently backs out.
--     That's expected: the number functions as a stable ticket/ID, not a
--     guarantee of zero gaps in a physical seating chart.

drop trigger if exists on_profile_attending_change on public.profiles;
drop function if exists public.assign_seat_number();

-- Unique across every student who has ever been assigned a number -- not just
-- currently-attending ones, since numbers now persist regardless of status.
drop index if exists profiles_seat_number_unique;
create unique index profiles_seat_number_unique
  on public.profiles (seat_number)
  where role = 'student' and seat_number is not null;

create or replace function public.assign_seat_number()
returns trigger as $$
begin
  if new.role = 'student' then
    -- Assign once: only the very first time they confirm "Ya" and don't
    -- already hold a number. Everything after that leaves seat_number untouched.
    if new.attending = true and new.seat_number is null then
      perform pg_advisory_xact_lock(hashtext('profiles_seat_number'));
      new.seat_number := coalesce(
        (select max(seat_number) from public.profiles where role = 'student'),
        0
      ) + 1;
    end if;
  else
    new.seat_number := null;
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_attending_change
  before update on public.profiles
  for each row execute procedure public.assign_seat_number();
