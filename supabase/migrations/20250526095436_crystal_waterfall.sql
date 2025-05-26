/*
  # Security Enhancements

  1. Changes
    - Fix function search path for update_user_plan_analytics
    - Add security best practices
    - Document MFA and password protection requirements
  
  2. Security
    - Set explicit search_path for functions
    - Add SECURITY DEFINER
    - Add proper function documentation
*/

-- Fix function search path and add proper documentation
COMMENT ON FUNCTION public.update_user_plan_analytics(uuid, public.plan_type, boolean) IS 
'Updates user plan analytics with proper security controls.
- Requires: user_id (uuid), new_plan (plan_type), is_upgrade (boolean)
- Security: SECURITY DEFINER with fixed search_path
- Updates: user_plan_analytics table with plan changes';

CREATE OR REPLACE FUNCTION public.update_user_plan_analytics(
  user_id uuid,
  new_plan public.plan_type,
  is_upgrade boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user plan analytics
  INSERT INTO user_plan_analytics (
    user_id,
    plan_type,
    is_active,
    upgrade_date,
    downgrade_date
  )
  VALUES (
    user_id,
    new_plan,
    true,
    CASE WHEN is_upgrade THEN CURRENT_TIMESTAMP ELSE NULL END,
    CASE WHEN NOT is_upgrade THEN CURRENT_TIMESTAMP ELSE NULL END
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    is_active = true,
    upgrade_date = CASE WHEN is_upgrade THEN CURRENT_TIMESTAMP ELSE user_plan_analytics.upgrade_date END,
    downgrade_date = CASE WHEN NOT is_upgrade THEN CURRENT_TIMESTAMP ELSE user_plan_analytics.downgrade_date END,
    updated_at = CURRENT_TIMESTAMP;
END;
$$;

-- Add security recommendations as schema comments
COMMENT ON SCHEMA public IS E'Standard public schema with enhanced security recommendations:\n
1. Enable leaked password protection via Supabase dashboard\n
2. Configure additional MFA methods (TOTP, SMS) for stronger authentication\n
3. Regular security audits recommended';

-- Create security settings table to track configuration
CREATE TABLE IF NOT EXISTS security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name text NOT NULL UNIQUE,
  is_enabled boolean NOT NULL DEFAULT false,
  last_updated timestamp with time zone DEFAULT now(),
  updated_by text,
  notes text
);

-- Enable row level security
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Add policy for security settings
CREATE POLICY "Only authenticated users can view security settings"
  ON security_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial security tracking records
INSERT INTO security_settings (setting_name, is_enabled, notes)
VALUES 
  ('leaked_password_protection', false, 'Enable via Supabase dashboard for enhanced security'),
  ('mfa_totp', false, 'Enable TOTP-based MFA via dashboard'),
  ('mfa_sms', false, 'Enable SMS-based MFA via dashboard')
ON CONFLICT (setting_name) DO NOTHING;