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

async function createAdminUsers() {
  try {
    console.log('Creating admin users...')
    
    // Hash passwords and insert admin users
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
    
    console.log('Admin users creation completed!')
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin users:', error)
    process.exit(1)
  }
}

createAdminUsers()