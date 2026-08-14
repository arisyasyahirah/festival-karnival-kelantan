-- Fixes: gallery images uploaded to Supabase Storage don't show up on the site,
-- even though the "gallery" bucket is marked Public.
--
-- Why: marking a bucket "Public" only means files can be *downloaded* via their
-- direct public URL without auth. It does NOT automatically let anyone LIST what
-- files are in the bucket -- that's a separate operation (storage.objects SELECT)
-- and is blocked by Row Level Security by default, public bucket or not.
-- The site's gallery page (and homepage slideshow) call
-- supabase.storage.from('gallery').list(...) to discover what images exist,
-- which is exactly the operation this was missing.

drop policy if exists "Public can list gallery bucket" on storage.objects;

create policy "Public can list gallery bucket"
on storage.objects for select
to public
using (bucket_id = 'gallery');
