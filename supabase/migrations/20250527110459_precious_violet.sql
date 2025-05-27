/*
  # User Onboarding and Admin Features

  1. New Tables
    - user_onboarding
      - Stores user onboarding responses
      - Tracks onboarding completion status
    - admin_access
      - Controls admin privileges
      - Stores admin-specific settings
    - custom_instructions
      - Stores user-specific instruction preferences
  
  2. Security
    - RLS policies for all new tables
    - Admin-only access controls
    - Secure data access patterns
*/

-- User Onboarding Table
CREATE TABLE IF NOT EXISTS user_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  experience_level text,
  primary_use_case text,
  preferred_models text[],
  custom_preferences jsonb DEFAULT '{}',
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_onboarding
CREATE POLICY "Users can view their own onboarding data"
  ON user_onboarding
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding data"
  ON user_onboarding
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding data"
  ON user_onboarding
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin Access Table
CREATE TABLE IF NOT EXISTS admin_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at timestamp with time zone DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  permissions jsonb DEFAULT '{}',
  CONSTRAINT unique_admin_user UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_access
CREATE POLICY "Only admin can view admin access"
  ON admin_access
  FOR SELECT
  TO authenticated
  USING (auth.uid() = '9333c569-7470-4e13-a264-77390556f659');

-- Insert admin user
INSERT INTO admin_access (user_id, permissions)
VALUES (
  '9333c569-7470-4e13-a264-77390556f659',
  '{"super_admin": true, "can_manage_users": true, "can_view_analytics": true}'
)
ON CONFLICT (user_id) DO NOTHING;

-- Custom Instructions Table
CREATE TABLE IF NOT EXISTS custom_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  is_active boolean DEFAULT true,
  model_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE custom_instructions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_instructions
CREATE POLICY "Users can manage their own instructions"
  ON custom_instructions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enhance session tracking
ALTER TABLE user_sessions 
ADD COLUMN IF NOT EXISTS last_activity timestamp with time zone,
ADD COLUMN IF NOT EXISTS active_duration interval,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Create function to update session activity
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.last_activity = now();
  NEW.active_duration = COALESCE(OLD.active_duration, '0 seconds'::interval) + 
    CASE 
      WHEN OLD.last_activity IS NULL THEN '0 seconds'::interval
      ELSE now() - OLD.last_activity
    END;
  RETURN NEW;
END;
$$;

-- Create trigger for session activity
CREATE TRIGGER update_session_activity_trigger
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

-- Create function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_access 
    WHERE user_id = $1 
    AND is_active = true
  );
$$;