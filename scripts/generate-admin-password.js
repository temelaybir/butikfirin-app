const bcrypt = require('bcryptjs')

async function generatePasswordHash() {
  const password = 'Admin123!'
  const saltRounds = 12
  
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('🔐 Admin Password Hash Generated:')
    console.log('Password:', password)
    console.log('Hash:', hash)
    console.log('\n📝 Migration kullanımı için:')
    console.log(`password_hash: '${hash}'`)
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash)
    console.log('\n✅ Hash validation:', isValid ? 'SUCCESS' : 'FAILED')
    
  } catch (error) {
    console.error('Error generating hash:', error)
  }
}

generatePasswordHash() 