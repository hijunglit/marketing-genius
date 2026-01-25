create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin 
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            insert into public.profiles(profile_id, name, username)
            values(new.id, 'Anonnymous', 'Anonnymous');
        end if;
    end if;
    return new;
end;
$$;

create trigger user_to_profile_trigger
after insert on auth.users
for each row execute function public.handle_new_user();


----------------------------------------seed data--------------------------------------------------
-- @app/sql/migrations Use this migration files to get the context you need to generate a seed.sql file to seed each table in the database. For 'profile_id' column this value 'aba0f396-a2a2-4cb9-abdb-efb0bee6d846', respect composite primary keys, unique values so on. Create at least 5 rows per table. Do not seed 'profiles' use 'aba0f396-a2a2-4cb9-abdb-efb0bee6d846' everwhere.