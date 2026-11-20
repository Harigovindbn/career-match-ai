-- CareerMatch AI: lock down user data with Row Level Security.
--
-- Before this migration, the public (anon) API key could read every user's
-- profile and resume, insert rows, and list files in the "resumes" bucket.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> Run.
-- It is idempotent (safe to run more than once).

-- ---------------------------------------------------------------- profiles
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles_delete_own" on public.profiles
  for delete to authenticated using ((select auth.uid()) = id);

-- ----------------------------------------------------------------- resumes
alter table public.resumes enable row level security;

drop policy if exists "resumes_select_own" on public.resumes;
drop policy if exists "resumes_insert_own" on public.resumes;
drop policy if exists "resumes_update_own" on public.resumes;
drop policy if exists "resumes_delete_own" on public.resumes;

create policy "resumes_select_own" on public.resumes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "resumes_insert_own" on public.resumes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "resumes_update_own" on public.resumes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "resumes_delete_own" on public.resumes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------- resume_optimizations
alter table public.resume_optimizations enable row level security;

drop policy if exists "optimizations_select_own" on public.resume_optimizations;
drop policy if exists "optimizations_insert_own" on public.resume_optimizations;
drop policy if exists "optimizations_update_own" on public.resume_optimizations;
drop policy if exists "optimizations_delete_own" on public.resume_optimizations;

create policy "optimizations_select_own" on public.resume_optimizations
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "optimizations_insert_own" on public.resume_optimizations
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "optimizations_update_own" on public.resume_optimizations
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "optimizations_delete_own" on public.resume_optimizations
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ------------------------------------------------- storage: "resumes" bucket
-- Files are stored at "<user id>/<file name>", so the first folder must match.
-- Remove any older, broader policies on storage.objects for this bucket in
-- Storage -> Policies if anonymous listing still works after running this.
drop policy if exists "resumes_bucket_select_own" on storage.objects;
drop policy if exists "resumes_bucket_insert_own" on storage.objects;
drop policy if exists "resumes_bucket_update_own" on storage.objects;
drop policy if exists "resumes_bucket_delete_own" on storage.objects;

create policy "resumes_bucket_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "resumes_bucket_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "resumes_bucket_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "resumes_bucket_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- -------------------------------------- auto-create a profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  begin
    insert into public.profiles (id, full_name)
    values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''))
    on conflict (id) do nothing;
  exception when others then
    -- Never block sign-up; the app also upserts the profile on first save.
    raise warning 'handle_new_user: could not create profile for %: %', new.id, sqlerrm;
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
