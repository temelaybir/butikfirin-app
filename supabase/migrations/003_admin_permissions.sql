-- Add missing columns to admin_users table
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS permissions TEXT[],
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45);

-- Create admin_role_permissions table
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role VARCHAR(50) NOT NULL,
  permission_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_role_permissions_role ON admin_role_permissions(role);

-- Insert role permissions for super_admin
INSERT INTO admin_role_permissions (role, permission_name) VALUES
  ('super_admin', 'manage_products'),
  ('super_admin', 'manage_categories'),
  ('super_admin', 'manage_orders'),
  ('super_admin', 'view_reports'),
  ('super_admin', 'manage_users'),
  ('super_admin', 'manage_settings'),
  ('super_admin', 'manage_theme'),
  ('super_admin', 'manage_pages'),
  ('super_admin', 'manage_content'),
  ('super_admin', 'export_data')
ON CONFLICT (role, permission_name) DO NOTHING;

-- Insert role permissions for admin
INSERT INTO admin_role_permissions (role, permission_name) VALUES
  ('admin', 'manage_products'),
  ('admin', 'manage_categories'),
  ('admin', 'manage_orders'),
  ('admin', 'view_reports')
ON CONFLICT (role, permission_name) DO NOTHING;