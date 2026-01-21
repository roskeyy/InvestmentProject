import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function initDatabase() {
  try {
    // 检查表是否已存在
    const adminExists = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'admins'
      )
    `

    if (adminExists[0]?.exists) {
      console.log('Tables already exist, skipping creation')
      return
    }

    // 创建表
    await prisma.$executeRaw`
      CREATE TABLE admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await prisma.$executeRaw`
      CREATE TABLE invite_codes (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT true,
        max_uses INTEGER DEFAULT 100,
        used_count INTEGER DEFAULT 0,
        valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valid_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        FOREIGN KEY (created_by) REFERENCES admins(id)
      )
    `

    await prisma.$executeRaw`
      CREATE TABLE test_records (
        id TEXT PRIMARY KEY,
        invite_code_id TEXT NOT NULL,
        answers JSONB,
        personality_type TEXT NOT NULL,
        scores JSONB,
        ip_address TEXT,
        user_agent TEXT,
        poster_url TEXT,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invite_code_id) REFERENCES invite_codes(id)
      )
    `

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()
