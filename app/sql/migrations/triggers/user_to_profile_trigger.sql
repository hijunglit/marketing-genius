drop function if exists public.handle_new_user() CASCADE;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin 
    if new.raw_app_meta_data is not null then
    -- ? : JSON객체에 특정 키가 있는지 알려줌 
    -- ->>: JSON객체의 특정 키에서 값을 뽑아줌
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            if new.raw_user_meta_data ? 'name' AND new.raw_user_meta_data ? 'username' then
                insert into public.profiles(profile_id, name, username)
                values(new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'username');
            else
                insert into public.profiles(profile_id, name, username)
                values(new.id, 'Anonnymous', 'mr.' || substr(md5(random()::text), 1, 8));
            end if;
        end if;

        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'kakao' then
            insert into public.profiles(profile_id, name, username, avatar_url)
            values(new.id, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'preferred_username'|| substr(md5(random()::text), 1, 5), new.raw_user_meta_data ->> 'avatar_url');
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