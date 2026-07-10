-- Storage buckets used by the app: member/profile avatars and payment receipts.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

create policy avatars_public_read on storage.objects for select
  using (bucket_id = 'avatars');

create policy avatars_authenticated_write on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy avatars_authenticated_update on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars')
  with check (bucket_id = 'avatars');

create policy receipts_staff_read on storage.objects for select
  to authenticated
  using (bucket_id = 'receipts' and current_role_name() in ('chu_hui', 'pho_chu_hui', 'ke_toan'));

create policy receipts_staff_write on storage.objects for insert
  to authenticated
  with check (bucket_id = 'receipts' and current_role_name() in ('chu_hui', 'pho_chu_hui', 'ke_toan'));
