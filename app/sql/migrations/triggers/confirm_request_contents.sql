create or replace function public.confirm_request_contents(
  p_request_id bigint,
  p_text text,
  p_hashtag text,
  p_image_urls text[]
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contents_id bigint;
begin
  -- 소유권 + 아직 confirm 안 됐는지 체크
  if not exists (
    select 1
    from public.request_contents rc
    where rc.request_id = p_request_id
      and rc.profile_id = auth.uid()
      and rc.contents_id is null
      and rc.is_confirm = false  
  ) then
    raise exception 'not allowed or already confirmed';
  end if;

    -- 2) 이미지 필수 체크
  if p_image_urls is null
     or array_length(p_image_urls, 1) is null
     or array_length(p_image_urls, 1) < 1 then
    raise exception 'image_urls_required';
  end if;

  -- contents 생성 (bigint PK가 identity/bigserial이라면 자동 생성)
  insert into public.contents (text, hashtag)
  values (p_text, p_hashtag)
  returning contents_id into v_contents_id;

  -- 4) images 테이블 insert (1 row per image)
  insert into images(contents_id, image_url)
  select v_contents_id, url
  from unnest(p_image_urls) as url;

  -- request_contents에 contents_id 연결
  update public.request_contents
  set 
    contents_id = v_contents_id, 
    is_confirm = true
  where request_id = p_request_id;

  return v_contents_id;
end;
$$;