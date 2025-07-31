const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Admin users to create
const adminUsers = [
  {
    username: 'superadmin',
    password: 'h01h0203',
    role: 'super_admin',
    full_name: 'Super Admin',
    email: 'superadmin@butikfirin.com'
  },
  {
    username: 'butikadmin',
    password: 'h01h0203',
    role: 'admin',
    full_name: 'Admin User',
    email: 'admin@butikfirin.com'
  }
]

// Role permissions
const rolePermissions = [
  // Super admin permissions (has all permissions by default)
  {
    role: 'super_admin',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'view_reports',
      'manage_users',
      'manage_settings',
      'manage_theme',
      'manage_pages',
      'manage_content',
      'export_data'
    ]
  },
  // Regular admin permissions
  {
    role: 'admin',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'view_reports'
    ]
  }
]

async function setupAdminUsers() {
  try {
    console.log('Setting up admin users and permissions...')
    
    // Create admin_role_permissions table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_role_permissions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          role VARCHAR(50) NOT NULL,
          permission_name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(role, permission_name)
        );
        
        -- Add missing columns to admin_users table
        ALTER TABLE admin_users 
        ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
        ADD COLUMN IF NOT EXISTS email VARCHAR(255),
        ADD COLUMN IF NOT EXISTS avatar_url TEXT,
        ADD COLUMN IF NOT NULL,
        ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45),
        ADD COLUMN IF NOT EXISTS permissions TEXT[];
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
        CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
        CREATE INDEX IF NOT EXISTS idx_admin_role_permissions_role ON admin_role_permissions(role);
      `
    })
    
    if (tableError) {
      console.error('Error creating tables:', tableError)
      process.exit(1)
    }
    
    // Insert role permissions
    console.log('Inserting role permissions...')
    for (const rolePerm of rolePermissions) {
      for (const permission of rolePerm.permissions) {
        const { error: permError } = await supabase
          .from('admin_role_permissions')
          .upsert({
            role: rolePerm.role,
            permission_name: permission
          }, {
            onConflict: 'role,permission_name'
          })
          
        if (permError) {
          console.error(`Error inserting permission ${permission} for role ${rolePerm.role}:`, permError)
        }
      }
    }
    
    // Hash passwords and insert admin users
    console.log('Creating admin users...')
    for (const user of adminUsers) {
      // Hash password
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(user.password, saltRounds)
      
      // Insert user
      const { data, error } = await supabase
        .from('admin_users')
        .upsert({
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          password_hash: passwordHash,
          role: user.role,
          is_active: true
        }, {
          onConflict: 'username'
        })
        .select()
        
      if (error) {
        console.error(`Error creating user ${user.username}:`, error)
      } else {
        console.log(`Successfully created/updated user: ${user.username}`)
      }
    }
    
    console.log('Admin users and permissions setup completed!')
    process.exit(0)
  } catch (error) {
    console.error('Error setting up admin users:', error)
    process.exit(1)
  }
}

setupAdminUsers()