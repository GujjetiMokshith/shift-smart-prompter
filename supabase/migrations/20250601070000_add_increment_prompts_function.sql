
-- Function to increment user prompt count
CREATE OR REPLACE FUNCTION increment_user_prompts(user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles 
  SET prompts_used = COALESCE(prompts_used, 0) + 1
  WHERE id = user_id;
$$;
